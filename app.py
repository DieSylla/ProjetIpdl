# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
import mysql.connector
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import warnings
from sklearn.exceptions import ConvergenceWarning

app = Flask(__name__)

# Configuration de la connexion MySQL
config = {
    'host': 'localhost',
    'port': 8889,  # Port par défaut de MySQL dans MAMP
    'user': 'ipdl',
    'password': 'passer',
    'database': 'gestionTuto'
}

# Ignorer les avertissements de convergence
warnings.filterwarnings("ignore", category=ConvergenceWarning)

# Fonction pour calculer le nombre optimal de clusters
def find_optimal_clusters(video_vectors):
    silhouette_scores = []
    k_range = range(2, min(15, video_vectors.shape[0] + 1))  # S'assurer que k ne dépasse pas le nombre d'échantillons
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42)
        cluster_labels = kmeans.fit_predict(video_vectors)
        silhouette_avg = silhouette_score(video_vectors, cluster_labels)
        silhouette_scores.append(silhouette_avg)
    optimal_k = k_range[silhouette_scores.index(max(silhouette_scores))]
    return optimal_k

# Fonction de recommandation
def recommend_videos(user_id, video_df, num_recommendations=8):
    try:
        # Connexion à la base de données pour récupérer l'historique de visionnage
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        query = "SELECT id_tuto FROM historique WHERE idEtud = %s"
        cursor.execute(query, (user_id,))
        user_history = cursor.fetchall()
        
        cursor.close()
        conn.close()

        if not user_history:
            # Si l'historique est vide, recommander une vidéo de chaque cluster
            recommendations = []
            for cluster in range(video_df['cluster'].nunique()):
                cluster_videos = video_df[video_df['cluster'] == cluster]
                if not cluster_videos.empty:
                    recommendations.append(cluster_videos.sample(n=1).to_dict(orient='records')[0])
            # Ajouter des vidéos supplémentaires si nécessaire pour atteindre le nombre minimum de recommandations
            if len(recommendations) < num_recommendations:
                additional_videos = video_df[~video_df['id_tuto'].isin([rec['id_tuto'] for rec in recommendations])]
                additional_recommendations = additional_videos.sample(n=num_recommendations - len(recommendations))
                recommendations.extend(additional_recommendations.to_dict(orient='records'))
            return recommendations

        user_history = [item[0] for item in user_history]
        
        # Récupérer les clusters des vidéos de l'historique
        user_clusters = video_df[video_df['id_tuto'].isin(user_history)]['cluster'].unique()

        recommended_videos = video_df[(video_df['cluster'].isin(user_clusters)) & (~video_df['id_tuto'].isin(user_history))]

        if recommended_videos.empty:
            return []

        # Ajouter des vidéos des clusters non présents dans l'historique
        diverse_clusters = video_df[~video_df['cluster'].isin(user_clusters)]
        diverse_recommendations = diverse_clusters.sample(n=min(num_recommendations, len(diverse_clusters)))

        # Combiner les deux ensembles de recommandations
        combined_recommendations = pd.concat([recommended_videos, diverse_recommendations]).drop_duplicates()

        # Si le nombre total de recommandations est inférieur au nombre minimum requis, ajouter des vidéos supplémentaires
        if len(combined_recommendations) < num_recommendations:
            additional_videos = video_df[~video_df['id_tuto'].isin(combined_recommendations['id_tuto'])]
            additional_recommendations = additional_videos.sample(n=num_recommendations - len(combined_recommendations))
            combined_recommendations = pd.concat([combined_recommendations, additional_recommendations]).drop_duplicates()

        return combined_recommendations.sample(n=min(num_recommendations, len(combined_recommendations)))[['id_tuto', 'titre', 'matiere', 'niveau', 'description']].to_dict(orient='records')

    except mysql.connector.Error as err:
        return jsonify({'error': f"Erreur de connexion à MySQL: {err}"}), 400
    except Exception as e:
        return jsonify({'error': f"Une erreur s'est produite: {e}"}), 400

@app.route('/recommend', methods=['POST'])
def recommend_handler():
    try:
        user_id = request.form.get('user_id')
        
        if user_id is None:
            return jsonify({'error': "Le paramètre 'user_id' est manquant dans la requête."}), 400

        user_id = int(user_id)

        # Connexion à la base de données pour récupérer les vidéos
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        query = "SELECT id_tuto, titre, matiere, niveau, description, instructeur, duree FROM lestutoriels"
        cursor.execute(query)
        videos = cursor.fetchall()

        cursor.close()
        conn.close()

        video_df = pd.DataFrame(videos, columns=['id_tuto', 'titre', 'matiere', 'niveau', 'description', 'instructeur', 'duree'])
        video_df['combined_text'] = video_df['titre'] + ' ' + video_df['matiere'].astype(str) + ' ' + video_df['niveau'].astype(str) + ' ' + video_df['description']

        vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        video_vectors = vectorizer.fit_transform(video_df['combined_text'])

        k = find_optimal_clusters(video_vectors)
        kmeans = KMeans(n_clusters=k, random_state=42)
        video_clusters = kmeans.fit_predict(video_vectors)
        video_df['cluster'] = video_clusters

        recommendations = recommend_videos(user_id, video_df)
        return jsonify(recommendations)
    except ValueError:
        return jsonify({'error': "Le paramètre 'user_id' doit être un entier valide."}), 400
    except mysql.connector.Error as err:
        return jsonify({'error': f"Erreur de connexion à MySQL: {err}"}), 400
    except Exception as e:
        return jsonify({'error': f"Une erreur s'est produite: {e}"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

    