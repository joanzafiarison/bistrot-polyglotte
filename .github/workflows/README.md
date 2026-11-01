# Bistrot Polyglotte

App mobile (React Native + Expo) pour s'entraîner à prendre une commande au restaurant en russe, espagnol, italien, anglais et roumain : phrases avec lecture vocale, textes à trous, dialogues et menu du jour personnalisable.

## Lancer l'app sur ton téléphone pendant le développement

```bash
npm install
npx expo start
```

Scanne le QR code avec l'app **Expo Go** (Android ou iPhone).

## Compiler avec GitHub Actions

Le fichier `.github/workflows/eas.yml` lance les commandes EAS depuis GitHub.

### 1. Créer le jeton Expo
1. Connecte-toi sur https://expo.dev.
2. Va dans **Account settings › Access tokens › Create token**, donne-lui un nom (ex. `github-actions`) et copie-le. Il ne s'affiche qu'une fois.

### 2. Ajouter le jeton au dépôt GitHub
1. Dans le dépôt : **Settings › Secrets and variables › Actions › New repository secret**.
2. Nom : `EXPO_TOKEN`. Valeur : le jeton copié. Enregistre.

### 3. Lancer une commande
Dans l'onglet **Actions** › **EAS** › **Run workflow**, choisis la commande :

| Commande | Ce qu'elle fait |
|---|---|
| `init` | **À lancer une seule fois.** Crée le projet sur expo.dev et enregistre son identifiant dans `app.json`. |
| `build-preview` | Fabrique un **APK** Android à installer directement sur un téléphone. |
| `build-production` | Fabrique un **AAB** Android pour le Google Play Store. |
| `build-and-submit` | Comme `build-production`, puis envoie l'app sur le Play Store (piste de test interne). |

Depuis un terminal, avec l'outil `gh` :

```bash
gh workflow run eas.yml -f commande=build-preview -f plateforme=android
```

Pousser un tag (`git tag v1.0.1 && git push --tags`) lance aussi un build de production Android.

### 4. Récupérer l'app
Le build tourne sur les serveurs d'Expo (10 à 20 minutes). Le lien de téléchargement apparaît sur **expo.dev › bistrot-polyglotte › Builds**.

## Publier
- **Google Play** : il faut un compte développeur Google Play. La toute première version doit être envoyée à la main dans la Play Console (fichier `.aab`). Ensuite, `build-and-submit` peut l'envoyer seul, une fois une clé de compte de service Google ajoutée dans expo.dev (Credentials › Android › Google Service Account Key).
- **App Store (iPhone)** : il faut un compte Apple Developer (99 $/an). Le premier build iOS doit être lancé une fois depuis un ordinateur (`npx eas-cli build -p ios`) pour connecter le compte Apple. Après ça, la plateforme `ios` fonctionne depuis GitHub.

## Si un build échoue
- **« EXPO_TOKEN est absent »** : refais l'étape 2.
- **« projet pas encore lié »** : lance la commande `init`.
- **Erreur de keystore Android** : lance une fois `npx eas-cli build -p android --profile preview` depuis un ordinateur pour créer la clé de signature, puis relance depuis GitHub.
- L'identifiant de l'app est `com.joanzaf.bistrotpolyglotte` (dans `app.json`). Change-le avant la première publication si tu veux un autre nom : il ne peut plus changer ensuite sur le Play Store.

## Ce qui diffère de la version web
- La sauvegarde (plats, menu, progression) se fait sur le téléphone.
- La traduction automatique des plats n'est pas incluse : remplis les langues à la main lors de l'ajout, ou laisse vide pour afficher le nom français.
