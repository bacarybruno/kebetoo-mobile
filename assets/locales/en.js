const locales = Object.freeze({
  general: {
    skip: 'Skip',
    get_started: 'Get Started',
    actions: 'Actions',
    options: 'Options',
    cancel: 'Cancel',
    no_content: 'No content yet',
    edited: 'Edited',
    post: 'Post',
    edit: 'Edit',
    save: 'Save',
    share: 'Share',
    confirm: 'Confirm',
    system_default: 'System default',
    audio: 'Audio',
    new: 'New',
    on: 'On',
    off: 'Off',
    read_more: 'Read more',
    show_less: 'Show less',
    send: 'Send',
    support: 'Support',
    not_implemented_title: 'Information',
    not_implemented_description: 'This feature has not been enabled yet. It will be available in the next versions of Kebetoo.',
    create: 'Create',
    ok: 'Ok',
  },
  onboarding: {
    screen_one_title: 'Join Our Social Media',
    screen_one_description: 'Kebetoo is a microblogging app with *African DNA*. Be one of the first to join the adventure 💪',
    screen_two_title: 'It\'s your turn to speak',
    screen_two_description: 'With Kebetoo, you can create and share public posts of all types: videos, images, texts but also... *voice messages* 🎤',
    screen_three_title: 'React to the Contents You Care About',
    screen_three_description: 'React and comment in a *simple and intuitive* way the posts that interest you the most ❤️',
  },
  auth: {
    email: 'Email',
    fullname: 'Full Name',
    password: 'Password',
    username: 'Username',
    signup: 'Sign up',
    signin: 'Sign in',
    or_signup_with: 'Or sign up with',
    or_signin_with: 'Or sign in with',
    have_account: 'Already have an account?',
    dont_have_account: 'Don\'t have an account?',
    forgot_password: 'Forgot your password?',
    accept_terms: 'By signing up, you agree to Kebetoo\'s {0} and {1}',
    terms_and_conditions: 'Terms & Conditions',
    privacy_policy: 'Privacy Policy',
    tos_url: 'https://kebetoo.com/tos.html?lang=en',
    privacy_policy_url: 'https://kebetoo.com/privacy.html?lang=en',
  },
  tabs: {
    home: 'Home',
    stories: 'Stories',
    notifications: 'Notifications',
    search: 'Search',
    profile: 'Profile',
    rooms: 'Rooms',
  },
  home: {
    welcome: 'Hey {0},',
    whats_new: 'Happy to see you!',
    sort_trending: 'Trending',
    sort_recent: 'Recents',
    hide_post: 'Hide this post',
    hide_post_done: 'This post will no longer appear in your news feed',
    report_post: 'Report this post',
    report_post_message: 'I\'m reporting this post because ...',
    block_author_done: 'You\'ll no longer see {0}\'s posts',
    block_author: 'Block {0}',
  },
  profile: {
    posts: 'Posts',
    reactions: 'Reactions',
    comments: 'Comments',
    manage_posts_title: 'Manage posts',
    manage_posts_desc: 'View, edit or delete your posts',
    preferences: 'Preferences',
    dark_mode: 'Dark Mode',
    notifications: 'Notifications',
    language: 'Language',
    account: 'Account',
    edit_username: 'Edit username',
    no_username_defined: 'No username defined',
    edit_profile: 'Edit profile',
    signout: 'Sign out',
    invite_fiend_title: 'Invite a Friend',
    share_title: 'Kebetoo',
    share_url: 'https://kebetoo.com?lang=en',
    share_message: 'Download the Kebetoo app, the African social network!',
    dark: 'Dark',
    light: 'Light',
    application: 'Application',
    issue_or_feedback: 'Help & Feedback',
    edit_picture: 'Update picture',
    view_picture: 'Show picture',
    delete_picture: 'Delete picture',
    bio_placeholder: 'Share your interests or hobbies',
    bio: 'Bio',
  },
  manage_posts: {
    my_posts: 'Manage posts',
    edit_post: 'Edit post',
    delete_post: 'Delete post',
    no_content: 'Create your first post! 👇',
    delete_post_title: 'Delete this post?',
    delete_post_warning: 'This post will be permanently deleted. You will not be able to restore it later.',
  },
  languages: {
    en: 'English',
    fr: 'French',
    languages: 'Languages',
    switching_language: 'Switching language',
    switching_language_reload: 'Changing the language will reload the app. It will only take a few moments.',
  },
  comments: {
    no_content: 'Be the first to add a comment! 👇',
    add_comment: 'Add a comment...',
    recording: 'Recording',
    people_reacted: '{0} Reacted',
    replying_to: 'Replying to {0}',
  },
  create_post: {
    create_post: 'Create post',
    edit_post: 'Edit post',
    share_post: 'Share post',
    publish: 'Post',
    placeholder: 'What\'s on your mind?',
    report_mode_placeholder: 'Please describe your issue or feedback. This will not appear in posts.',
    characters: '{0} characters',
    all_videos: 'All Videos',
    all_photos: 'All Photos',
    albums: 'Albums',
    all_assets: 'All',
    album_empty: 'This album is empty',
    edit_photo: 'Edit Photo',
    post_created: 'Your post has successfully been created!',
    post_edited: 'Your post has successfully beed edited!',
    post_deleted: 'Your post has successfully beed deleted!',
    feedback_sent: 'Thanks for you feedback! We will examine it as soon as possible.',
    show_post_created: 'Show',
    caption: 'Your message',
  },
  reactions: {
    share_now: 'Share now',
    write_post: 'Edit and share',
  },
  search: {
    search: 'Search',
    placeholder: 'Search...',
    posts_tab: 'Posts',
    users_tab: 'Users',
    results: 'Results',
    recent_searches: 'Recent searches',
    clear_all: 'Clear all',
    no_result: 'No results found for search term "{0}"',
    no_content: 'Your search history will appear here',
  },
  user_profile: {
    profile: 'Profile',
    joined_in: 'Joined on {0}',
    published_post: 'published this post',
    shared_post: 'shared this post',
    commented_post: 'commented on this post',
    reacted_post: 'reacted on this post',
  },
  notifications: {
    commented_post: 'commented your post',
    reacted_comment: 'reacted on your comment',
    reacted_post: 'reacted on your post',
    recent: 'Recent',
    already_seen: 'Already seen',
    replied_comment: 'replied to your comment',
    no_content: 'Your notifications will appear here',
    new_count: '{0} new',
  },
  rooms: {
    created_by: 'Created by {0}',
    members: '{0} members',
    my_rooms: 'My Rooms ({0})',
    discover: 'Discover ({0})',
  },
  create_room: {
    create_room: 'Create room',
    room_name: 'Enter Room name (required)',
    room_theme: 'Select room theme',
  },
  room: {
    type_message: 'Message...',
    online_count: '{0} online',
    system_room_created: '{0} created the room',
    report_room: 'Report room',
    report_room_message: 'I\'m reporting this room because ...',
    exit_room: 'Exit room',
  },
  dates: {
    format_month_year: 'MMMM YYYY',
  },
  errors: {
    generic: 'An error occured',
    retry: 'Retry',
    required_field: '{0} field is required',
    invalid_field: 'Please enter a valid {0}',
    min_length_field: '{0} must be at least {1} characters',
    auth_user_not_found: 'This user does not exist. Please try to create an account instead',
    auth_wrong_password: 'The password is incorrect',
    auth_user_disabled: 'This user has been disabled',
    auth_email_already_in_use: 'This account already exists. Please try to log in instead',
    auth_account_exists_different_credential: 'The email used is already associated with another account. Please try another signin method',
    create_post_error: 'An error occured while creating the post. Please try again later.',
    username_taken: 'This username is already taken. Please try another one.',
    username_not_exist: 'This user does not exist',
  },
})

export default locales
