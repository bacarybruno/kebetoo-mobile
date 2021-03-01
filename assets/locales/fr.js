const locales = Object.freeze({
  general: {
    skip: 'Passer',
    get_started: 'Commencer',
    actions: 'Actions',
    options: 'Options',
    cancel: 'Fermer',
    no_content: 'Section vide',
    edited: 'Modifié',
    post: 'Publier',
    edit: 'Editer',
    save: 'Valider',
    share: 'Partager',
    confirm: 'Confirmer',
    system_default: 'Réglage par défaut',
    audio: 'Audio',
    new: 'Nouveau',
    on: 'Actif',
    off: 'Inactif',
    read_more: 'Lire la suite',
    show_less: 'Moins',
    send: 'Envoyer',
    support: 'Support',
    not_implemented_title: 'Information',
    not_implemented_description: 'Cette fonctionnalité n\'a pas encore été activée. Elle le sera dans les prochaines versions de Kebetoo.',
    create: 'Créer',
    ok: 'Ok',
  },
  onboarding: {
    screen_one_title: 'Rejoignez Notre Réseau Social',
    screen_one_description: 'Kebetoo est une application de microblogging à l\'{0}. Soyez parmi les premiers à rejoindre l\'aventure 💪',
    screen_two_title: 'A Vous la Parole',
    screen_two_description: 'Avec Kebetoo, vous pouvez créer et partager des posts publics de tous types: vidéos, images, textes mais aussi des... {0}! 🎤',
    screen_three_title: 'Réagissez aux Contenus Que Vous Aimez',
    screen_three_description: 'Réagissez et commentez de manière {0} les posts qui vous intéressent le plus ❤️',
    keyword_african_dna: 'ADN Africain',
    keyword_voice_messages: 'messages vocaux',
    keyword_simple_intuitive: 'simple et intuitive',
  },
  auth: {
    email: 'Email',
    fullname: 'Nom complet',
    password: 'Mot de passe',
    username: 'Nom d\'utilisateur',
    signup: 'S\'inscrire',
    signin: 'Se connecter',
    or_signup_with: 'Ou s\'inscrire avec',
    or_signin_with: 'Ou se connecter avec',
    have_account: 'Vous avez déjà un compte ?',
    dont_have_account: 'Vous n\'avez pas de compte ?',
    forgot_password: 'Mot de passe oublié ?',
    accept_terms: 'En continuant, vous acceptez nos {0} et {1}',
    terms_and_conditions: 'Conditions d\'utilisation',
    privacy_policy: 'Règles de confidentialité',
    tos_url: 'https://kebetoo.com/tos.html?lang=fr',
    privacy_policy_url: 'https://kebetoo.com/privacy.html?lang=fr',
  },
  tabs: {
    home: 'Accueil',
    stories: 'Stories',
    notifications: 'Notifications',
    search: 'Recherche',
    profile: 'Profil',
    rooms: 'Rooms',
  },
  home: {
    welcome: 'Salut {0},',
    whats_new: 'Content de vous voir!',
    sort_trending: 'Tendance',
    sort_recent: 'Récents',
    hide_post: 'Masquer ce post',
    hide_post_done: 'Ce post n\'apparaîtra plus dans votre fil d\'actualité',
    report_post: 'Signaler ce post',
    report_post_message: 'Je signale ce post car ...',
    block_author_done: 'Vous ne verrez plus les posts de {0}',
    block_author: 'Bloquer {0}',
  },
  profile: {
    posts: 'Posts',
    reactions: 'Reactions',
    comments: 'Commentaires',
    manage_posts_title: 'Gérer les posts',
    manage_posts_desc: 'Voir, editer ou supprimer vos posts',
    preferences: 'Préférences',
    dark_mode: 'Mode Sombre',
    notifications: 'Notifications',
    language: 'Langue',
    account: 'Compte',
    edit_username: 'Changer le nom d\'utilisateur',
    no_username_defined: 'Aucun nom d\'utilisateur défini',
    edit_profile: 'Modifier le profil',
    signout: 'Se déconnecter',
    invite_fiend_title: 'Inviter un Ami',
    share_title: 'Kebetoo',
    share_url: 'https://kebetoo.com?lang=fr',
    share_message: 'Téléchargez l\'application Kebetoo, le réseau social Africain!',
    dark: 'Sombre',
    light: 'Clair',
    application: 'Application',
    issue_or_feedback: 'Aide & Feedback',
    edit_picture: 'Modifier la photo',
    view_picture: 'Voir la photo',
    delete_picture: 'Supprimer la photo',
    bio_placeholder: 'Partagez vos centres d\'intérets ou hobbies',
    bio: 'Bio',
  },
  manage_posts: {
    my_posts: 'Mes publications',
    edit_post: 'Modifier le post',
    delete_post: 'Supprimer le post',
    no_content: 'Créer votre premier post ! 👇',
    delete_post_title: 'Supprimer ce post ?',
    delete_post_warning: 'Ce post sera définitivement supprimé. Vous ne pourrez pas le restaurer ultérieurement.',
  },
  languages: {
    en: 'Anglais',
    fr: 'Français',
    languages: 'Langues',
    switching_language: 'Changement de langues',
    switching_language_reload: 'Le changement de la langue rechargera l\'application. Cela ne prendra que quelques instants.',
  },
  comments: {
    no_content: 'Soyez le premier à ajouter un commentaire ! 👇',
    add_comment: 'Ajouter un commentaire...',
    recording: 'Entrain d\'enregistrer',
    people_reacted: '{0} ont réagi',
    replying_to: 'Réponse à {0}',
  },
  create_post: {
    create_post: 'Créer un post',
    edit_post: 'Modifier le post',
    share_post: 'Partager le post',
    publish: 'Publier',
    placeholder: 'Qu\'avez-vous à l\'esprit ?',
    report_mode_placeholder: 'Veuillez décrire votre problème ou vos suggestions. Cela n\'apparaîtra pas dans les posts.',
    characters: '{0} caractères',
    all_videos: 'Toutes les Videos',
    all_photos: 'Toutes les Photos',
    albums: 'Albums',
    all_assets: 'Tout',
    album_empty: 'Cet album est vide',
    edit_photo: 'Editer la photo',
    post_created: 'Votre post a bien été créé!',
    post_edited: 'Votre post a bien été modifié!',
    post_deleted: 'Votre post a bien été supprimé!',
    feedback_sent: 'Merci pour votre feedback! Nous allons l\'examiner dans les plus brefs délais.',
    show_post_created: 'Voir',
    caption: 'Votre message',
  },
  reactions: {
    share_now: 'Partager maintenant',
    write_post: 'Editer et partager',
  },
  search: {
    search: 'Recherche',
    placeholder: 'Rechercher...',
    posts_tab: 'Posts',
    users_tab: 'Utilisateurs',
    results: 'Resultats',
    recent_searches: 'Recherches récentes',
    clear_all: 'Tout effacer',
    no_result: 'Aucun résultat trouvé pour le terme de recherche "{0}"',
    no_content: 'Votre historique de recherche apparaitra ici',
  },
  user_profile: {
    profile: 'Profil',
    joined_in: 'A rejoint en {0}',
  },
  notifications: {
    commented_post: 'a commenté votre post',
    reacted_comment: 'a réagi à votre commentaire',
    reacted_post: 'a réagi à votre post',
    recent: 'Récent',
    already_seen: 'Déja consultés',
    replied_comment: 'a répondu à votre commentaire',
    no_content: 'Vos notifications vont apparaitre ici',
    new_count: '{0} nouv.',
  },
  rooms: {
    created_by: 'Créé par {0}',
    members: '{0} membres',
    my_rooms: 'Mes Rooms ({0})',
    discover: 'Découvrir ({0})',
  },
  create_room: {
    create_room: 'Créer une room',
    room_name: 'Nom de la room (requis)',
    room_theme: 'Selectionnez le thème principal',
  },
  room: {
    type_message: 'Message...',
    online_count: '{0} en ligne',
    system_room_created: '{0} a créé la room',
    report_room: 'Signaler cette room',
    report_room_message: 'Je signale cette room car ...',
    exit_room: 'Quitter cette room',
  },
  dates: {
    format_month_year: 'MMMM YYYY',
  },
  errors: {
    generic: 'Une erreur est survenue',
    retry: 'Réessayer',
    required_field: 'Veuillez entrer votre {0}',
    invalid_field: 'Veuillez entrer un {0} valide',
    min_length_field: '{0} doit contenir au moins {1} caractères',
    auth_user_not_found: 'Cet utilisateur n\'existe pas. Veuillez essayer de créer un compte',
    auth_wrong_password: 'Le mot de passe est incorrect',
    auth_user_disabled: 'Cet utilisateur a été désactivé',
    auth_email_already_in_use: 'Ce compte existe déjà. Veuillez essayer de vous connecter',
    auth_account_exists_different_credential: 'L\'e-mail utilisé est déjà associé à un autre compte. Veuillez essayer une autre méthode de connexion',
    create_post_error: 'Une erreur est survenue lors de la création du post. Merci de réessayer plus tard.',
    username_taken: 'Ce nom d\'utilisateur est deja pris. Veuillez en choisir un autre.',
  },
})

export default locales
