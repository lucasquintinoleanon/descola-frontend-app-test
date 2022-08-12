// BASE URL
export const BASE_URL_CDN = process.env.REACT_APP_CDN;
export const BASE_URL_API = process.env.REACT_APP_API;
export const BASE_URL_CERTIFICATE = process.env.REACT_APP_CERTIFICATE;
export const BASE_URL_APP_PUBLIC = process.env.REACT_APP_PUBLIC;
export const BASE_URL_APP_PRIVATE = process.env.REACT_APP_PRIVATE;

// paths
export const PAGE_ERROR = '/404';
export const PAGE_HOME = '/';
export const PAGE_RESET_PASSWORD = '/reset-password';
export const PAGE_TRACKS = '/tracks';
export const PAGE_COURSES = '/cursos';
export const PAGE_BUNDLES = '/bundles';
export const PAGE_DESIGN_THINKING =  '/design-thinking';
export const PAGE_BLOG =  '/blog';
export const PAGE_HELP =  '/faq';
export const PAGE_CONTACT =  '/contato';
export const PAGE_PRESS_OFFICE =  '/imprensa';
export const PAGE_TERMS_AND_CONDITIONS =  '/termos-de-uso';
export const PAGE_COOKIES_POLICY =  '/politica-de-cookies';
export const PAGE_PRIVACY_POLICY =  '/politica-de-privacidade';
export const PAGE_ABOUT =  '/sobre';
export const PAGE_FOR_COMPANIES =  '/empresas';
export const PAGE_MY_PROFILE = '/perfil';
export const PAGE_MY_COURSES = '/';
export const PAGE_MY_FAVORITES = '/favoritos';
export const PAGE_MY_CERTIFICATES = '/certificados';
export const PAGE_MY_PURCHASES = '/compras';
export const PAGE_INDICATIONS = '/indications';
export const PAGE_WATCH = '/assistir';
export const PAGE_SIGNATURE = '/signature';
export const PAGE_SOCIAL_RETURN = '/socialReturn';
export const PAGE_LOGIN = '/login';
export const PAGE_ORDER = '/pedidos';
export const PAGE_ATTACHMENTS = '/arquivos';
export const PAGE_SEARCH_RESULTS = '/busca';
export const PAGE_CONTENT_SLUG = '/';

//ROUTES
export const ROUTE_ERROR = '/404';
export const ROUTE_HOME = BASE_URL_APP_PUBLIC
export const ROUTE_RESET_PASSWORD = BASE_URL_APP_PRIVATE + 'reset-password';
export const ROUTE_TRACKS = BASE_URL_APP_PUBLIC + 'tracks';
export const ROUTE_COURSES = BASE_URL_APP_PUBLIC + 'cursos';
export const ROUTE_BUNDLES = BASE_URL_APP_PUBLIC + 'bundles';
export const ROUTE_DESIGN_THINKING = BASE_URL_APP_PUBLIC +  'design-thinking';
export const ROUTE_BLOG = BASE_URL_APP_PUBLIC +  'blog';
export const ROUTE_HELP = BASE_URL_APP_PUBLIC +  'faq';
export const ROUTE_CONTACT = BASE_URL_APP_PUBLIC +  'contato';
export const ROUTE_PRESS_OFFICE = BASE_URL_APP_PUBLIC +  'imprensa';
export const ROUTE_TERMS_AND_CONDITIONS = BASE_URL_APP_PUBLIC +  'termos-de-uso';
export const ROUTE_COOKIES_POLICY = BASE_URL_APP_PUBLIC +  'politica-de-cookies';
export const ROUTE_PRIVACY_POLICY = BASE_URL_APP_PUBLIC +  'politica-de-privacidade';
export const ROUTE_ABOUT = BASE_URL_APP_PUBLIC +  'sobre';
export const ROUTE_FOR_COMPANIES = BASE_URL_APP_PUBLIC +  'empresas';
export const ROUTE_MY_PROFILE = BASE_URL_APP_PRIVATE + 'perfil';
export const ROUTE_MY_COURSES = BASE_URL_APP_PRIVATE
export const ROUTE_MY_FAVORITES = BASE_URL_APP_PRIVATE + 'favoritos';
export const ROUTE_MY_CERTIFICATES = BASE_URL_APP_PRIVATE + 'certificados';
export const ROUTE_MY_PURCHASES = BASE_URL_APP_PRIVATE + 'compras';
export const ROUTE_INDICATIONS = BASE_URL_APP_PRIVATE + 'indications';
export const ROUTE_WATCH = BASE_URL_APP_PRIVATE + 'assistir';
export const ROUTE_SIGNATURE = BASE_URL_APP_PRIVATE + 'signature';
export const ROUTE_SOCIAL_RETURN = 'socialReturn';
export const ROUTE_LOGIN = BASE_URL_APP_PRIVATE + 'login';
export const ROUTE_ORDER = BASE_URL_APP_PRIVATE + 'pedidos';
export const ROUTE_ATTACHMENTS = BASE_URL_APP_PRIVATE + 'arquivos';
export const ROUTE_SEARCH_RESULTS = BASE_URL_APP_PUBLIC + 'busca';
export const ROUTE_CONTENT_SLUG = '';

// auth
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_REGISTER = 'AUTH_REGISTER';
export const AUTH_FORGOT_PASSWORD = 'AUTH_FORGOT_PASSWORD';

// filter courses
export const FILTER_NEWER = ['date', 'DESC'];
export const FILTER_OLDER = ['date', 'ASC'];
export const FILTER_ALPHABETICAL = ['title', 'ASC'];
export const FILTER_ALPHABETICAL_REVERSE = ['title', 'DESC'];
export const FILTER_MORE_EXPENSIVE = ['price', 'DESC'];
export const FILTER_CHEAPER = ['price', 'ASC'];

export const NUMBER_COURSES_VISIBLE = 9;

// types products number
export const TYPE_TRACKS = 1;
export const TYPE_COURSES = 3;
export const TYPE_BUNDLES = 7;
export const TYPE_CERTIFICATES = 8;

// types products string
export const TYPE_TRACKS_STRING = 'Track';
export const TYPE_COURSES_STRING = 'Course';
export const TYPE_BUNDLES_STRING = 'Bundle';
export const TYPE_CREDIT_STRING = 'Credit';
export const TYPE_CERTIFICATES_STRING = 'Certificate';

// types status order
export const TYPE_CREATED = 'Created';
export const TYPE_PROCESSING = 'Processing';
export const TYPE_APPROVED = 'Approved';
export const TYPE_COMPLETED = 'Completed';
export const TYPE_CANCELED = 'Canceled';
export const TYPE_AUTHORIZED = 'Authorized';

// status payment
export const STATUS_PAID = 1;
export const STATUS_WAITING_PAYMENT = 2;
export const STATUS_REFUSED = 3;
export const STATUS_REFUNDED = 4;
export const STATUS_CANCELLED = 5;
export const STATUS_PROCESSING = 6;
export const STATUS_AUTHORIZED = 7;

// types attachments
export const TYPE_EBOOK = 2;

// order my courses
export const ORDER_LAST_WATCHED = 'ORDER_LAST_WATCHED';
export const ORDER_COMPLETED = 'ORDER_COMPLETED';
export const ORDER_MOST_RECENT = 'ORDER_MOST_RECENT';
export const ORDER_TRACKS = 'ORDER_TRACKS';
export const ORDER_COURSES = 'ORDER_COURSES';
export const ORDER_FAVORITES = 'ORDER_FAVORITES';

// payment options
export const CREDIT_CARD = 1;
export const CREDITS = 2;
export const BOLETO = 4;

// order status
export const ONE = 1;
export const TWO = 2;
export const THREE = 3;
export const FOUR = 4;

export const PAGAR_ME_KEY = process.env.REACT_APP_PAGAR_ME_KEY;

// types on watch
export const TYPE_TRACK_ON_WATCH = 2;
export const TYPE_COURSE_ON_WATCH = 1;

export const TYPE_POST_ACTIVITY_ATTACHMENT = 1;
export const TYPE_POST_ACTIVITY_LECTURE = 2;
export const TYPE_POST_ACTIVITY_CERTIFICATE = 3;

export const TYPE_LECTURE_SELF_HOSTED_VIDEO = 'self_hosted_video';
export const TYPE_LECTURE_VIDEO = 'video';
export const TYPE_LECTURE_TEXT = 'text';
export const TYPE_LECTURE_IFRAME = 'iframe';

// banner
export const CREDITS_ID_3 = 314;
export const CREDITS_ID_5 = 311;
export const CREDITS_ID_10 = 310;
export const CREDITS_ID_20 = 313;
export const CREDITS_ID_ALL = 164;

// course accordions
export const DESCRIPTION = 'DESCRIPTION';
export const CONTENT = 'CONTENT';
export const TESTIMONIALS = 'TESTIMONIALS';
export const TEACHERS = 'TEACHERS';
export const MORE_INFORMATION = 'MORE_INFORMATION';

// API
export const UNAUTHORIZED = 401;

// POWER FRIDAY
export const IS_POWER_FRIDAY_ACTIVE = process.env.REACT_APP_IS_POWER_FRIDAY_ACTIVE.toLowerCase() === 'true';

export const COOKIE_BAR_LOCALSTORAGE_KEY = 'cookieBarWasClosed';

// types company models
export const TYPE_LMS = 11;
export const TYPE_PLATAFORM_CREDITS = 10;
export const TYPE_CURTOM_COURSES = 12;
export const TYPE_UNDEFINED = 7;
