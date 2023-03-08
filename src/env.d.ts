/// <reference types="astro/client" />

interface ImportMetaEnv {
    SPOTIFY_CLIENT_ID?: string;
    SPOTIFY_CLIENT_SECRET?: string;
    ENCRYPTION_SECRET?: string;
    ENCRYPTION_ALG?: string;
    AUDIO_CACHE_BUCKET_NAME?: string;
}
