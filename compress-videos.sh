#!/bin/bash

# Script de compression des vidéos pour optimiser la performance du site
# Utilise ffmpeg pour réduire la taille des fichiers tout en gardant une bonne qualité

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si ffmpeg est installé
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}ffmpeg n'est pas installé. Installez-le avec: brew install ffmpeg${NC}"
    exit 1
fi

# Créer un dossier pour les vidéos compressées
COMPRESSED_DIR="Medias-compressed"
mkdir -p "$COMPRESSED_DIR"

# Fonction pour compresser une vidéo
compress_video() {
    local input_file="$1"
    local output_file="$2"
    local size_before=$(ls -lh "$input_file" | awk '{print $5}')
    
    echo -e "${YELLOW}Compression de: $input_file ($size_before)${NC}"
    
    # Compression avec ffmpeg
    # -c:v libx264 : codec vidéo H.264
    # -crf 23 : qualité (18-28, plus bas = meilleure qualité)
    # -preset medium : vitesse d'encodage (ultrafast, fast, medium, slow, veryslow)
    # -c:a aac : codec audio AAC
    # -b:a 128k : bitrate audio
    # -movflags +faststart : optimisation pour le streaming web
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf 23 \
        -preset medium \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$output_file" 2>/dev/null
    
    local size_after=$(ls -lh "$output_file" | awk '{print $5}')
    echo -e "${GREEN}✓ Compressé: $output_file ($size_after)${NC}"
}

# Fonction pour créer une version WebM (optionnel, pour Chrome/Firefox)
create_webm() {
    local input_file="$1"
    local output_file="${2%.mp4}.webm"
    
    echo -e "${YELLOW}Création WebM: $input_file${NC}"
    
    ffmpeg -i "$input_file" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -c:a libopus \
        -b:a 128k \
        -y \
        "$output_file" 2>/dev/null
    
    echo -e "${GREEN}✓ WebM créé: $output_file${NC}"
}

# Parcourir toutes les vidéos MP4
echo -e "${GREEN}=== Début de la compression des vidéos ===${NC}"
echo ""

find Medias -name "*.mp4" | while read -r video; do
    # Créer la structure de dossiers dans Medias-compressed
    dir=$(dirname "$video")
    compressed_dir="${dir/Medias/$COMPRESSED_DIR}"
    mkdir -p "$compressed_dir"
    
    # Définir le fichier de sortie
    filename=$(basename "$video")
    output="$compressed_dir/$filename"
    
    # Compresser la vidéo
    compress_video "$video" "$output"
    
    # Optionnel: créer une version WebM (décommenter si souhaité)
    # create_webm "$video" "$output"
    
    echo ""
done

# Afficher le résumé
echo -e "${GREEN}=== Compression terminée ===${NC}"
echo ""
echo "Comparaison des tailles:"
echo "------------------------"
echo -e "${YELLOW}Original:${NC}"
du -sh Medias
echo -e "${GREEN}Compressé:${NC}"
du -sh "$COMPRESSED_DIR"

echo ""
echo -e "${GREEN}Pour utiliser les vidéos compressées:${NC}"
echo "1. Sauvegardez vos vidéos originales: mv Medias Medias-original"
echo "2. Utilisez les vidéos compressées: mv $COMPRESSED_DIR Medias"
echo ""
echo -e "${YELLOW}Note: Testez d'abord le site avec les vidéos compressées avant de supprimer les originales!${NC}"