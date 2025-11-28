export type Language = "en" | "pt" | "es" | "fr" | "de" | "hi";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.blog": "Blog",
    "nav.stories": "Stories",
    
    // Hero
    "hero.title": "Instant Burner Email Addresses",
    "hero.subtitle": "Free, private, and disposable email addresses. No signup required. Protect your real inbox from spam.",
    "hero.badge.free": "100% Free",
    "hero.badge.anonymous": "Anonymous",
    "hero.badge.instant": "Instant Setup",
    "hero.trusted": "Trusted by 100,000+ users worldwide",
    
    // Email Generator
    "email.title": "Your Temporary Email",
    "email.copy": "Copy",
    "email.copied": "Copied!",
    "email.generate": "Generate New Email",
    "email.burn": "Burn & Generate",
    "email.delete": "Delete All",
    "email.qr": "QR Code",
    "email.notifications": "Get notified of new emails",
    "email.enable": "Enable",
    "email.dismiss": "Dismiss",
    
    // Footer
    "footer.brand": "Free burner email addresses for anonymous, disposable privacy protection.",
    "footer.product": "Product",
    "footer.legal": "Legal",
    "footer.contact": "Contact",
    "footer.temp.email": "Temporary Email",
    "footer.extension": "Browser Extension",
    "footer.blog": "Blog & Guides",
    "footer.stories": "Success Stories",
    "footer.terms": "Terms & Conditions",
    "footer.privacy": "Privacy Policy",
    "footer.copyright": "All rights reserved. Your privacy is our priority.",
    "footer.free": "100% Free",
    "footer.anonymous": "Anonymous",
    "footer.nosignup": "No Signup",
    
    // Trust Section
    "trust.title": "Privacy Built In",
    "trust.subtitle": "No compromises. No backdoors. Just pure privacy protection backed by transparency and security.",
    "trust.metric.emails": "Emails Processed",
    "trust.metric.users": "Active Users",
    "trust.metric.uptime": "Uptime SLA",
    "trust.item1.title": "No Tracking",
    "trust.item1.subtitle": "Zero logs — we can't access your inbox.",
    "trust.item1.details": "We don't collect, store, or analyze your data",
    "trust.item2.title": "Cryptographic Security",
    "trust.item2.subtitle": "Military-grade encryption in every request.",
    "trust.item2.details": "End-to-end encryption protects your communications",
    "trust.item3.title": "No Data Storage",
    "trust.item3.subtitle": "Emails auto-delete — nothing stored.",
    "trust.item3.details": "All emails permanently deleted after 24 hours",
    
    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Everything you need to know about Burner Email and temporary email services",
    
    // Blog
    "blog.title": "Blog & Guides",
    "blog.subtitle": "Expert guides on temporary email, privacy protection, and email security best practices",
    "blog.search": "Search articles by topic, keyword...",
    "blog.sort": "Sort by:",
    "blog.latest": "Latest",
    "blog.trending": "Trending",
    "blog.indepth": "In-Depth",
    "blog.back": "Back to Home",
  },
  es: {
    // Header
    "nav.home": "Inicio",
    "nav.blog": "Blog",
    "nav.stories": "Historias",
    
    // Hero
    "hero.title": "Direcciones de correo temporal instantáneas",
    "hero.subtitle": "Direcciones de correo desechables gratuitas, privadas y anónimas. Sin registro requerido. Proteja su bandeja de entrada real del spam.",
    "hero.badge.free": "100% Gratis",
    "hero.badge.anonymous": "Anónimo",
    "hero.badge.instant": "Configuración Instantánea",
    "hero.trusted": "Confiado por más de 100,000 usuarios en todo el mundo",
    
    // Email Generator
    "email.title": "Tu correo temporal",
    "email.copy": "Copiar",
    "email.copied": "¡Copiado!",
    "email.generate": "Generar nuevo correo",
    "email.burn": "Quemar y generar",
    "email.delete": "Eliminar todo",
    "email.qr": "Código QR",
    "email.notifications": "Recibe notificaciones de nuevos correos",
    "email.enable": "Habilitar",
    "email.dismiss": "Descartar",
    
    // Footer
    "footer.brand": "Direcciones de correo temporal gratuitas para protección de privacidad anónima y desechable.",
    "footer.product": "Producto",
    "footer.legal": "Legal",
    "footer.contact": "Contacto",
    "footer.temp.email": "Correo Temporal",
    "footer.extension": "Extensión del Navegador",
    "footer.blog": "Blog y Guías",
    "footer.stories": "Historias de Éxito",
    "footer.terms": "Términos y Condiciones",
    "footer.privacy": "Política de Privacidad",
    "footer.copyright": "Todos los derechos reservados. Tu privacidad es nuestra prioridad.",
    "footer.free": "100% Gratis",
    "footer.anonymous": "Anónimo",
    "footer.nosignup": "Sin Registro",
    
    // Trust Section
    "trust.title": "Privacidad Integrada",
    "trust.subtitle": "Sin compromisos. Sin puertas traseras. Solo protección de privacidad pura respaldada por transparencia y seguridad.",
    "trust.metric.emails": "Correos Procesados",
    "trust.metric.users": "Usuarios Activos",
    "trust.metric.uptime": "SLA de Tiempo de Actividad",
    "trust.item1.title": "Sin Rastreo",
    "trust.item1.subtitle": "Cero registros — no podemos acceder a tu bandeja de entrada.",
    "trust.item1.details": "No recopilamos, almacenamos ni analizamos tus datos",
    "trust.item2.title": "Seguridad Criptográfica",
    "trust.item2.subtitle": "Encriptación de grado militar en cada solicitud.",
    "trust.item2.details": "Encriptación de extremo a extremo protege tus comunicaciones",
    "trust.item3.title": "Sin Almacenamiento de Datos",
    "trust.item3.subtitle": "Los correos se eliminan automáticamente — nada almacenado.",
    "trust.item3.details": "Todos los correos se eliminan permanentemente después de 24 horas",
    
    // FAQ
    "faq.title": "Preguntas Frecuentes",
    "faq.subtitle": "Todo lo que necesitas saber sobre Burner Email y servicios de correo temporal",
    
    // Blog
    "blog.title": "Blog y Guías",
    "blog.subtitle": "Guías de expertos sobre correo temporal, protección de privacidad y mejores prácticas de seguridad del correo electrónico",
    "blog.search": "Buscar artículos por tema, palabra clave...",
    "blog.sort": "Ordenar por:",
    "blog.latest": "Últimas",
    "blog.trending": "Tendencias",
    "blog.indepth": "En Profundidad",
    "blog.back": "Volver al Inicio",
  },
  pt: {
    // Header
    "nav.home": "Início",
    "nav.blog": "Blog",
    "nav.stories": "Histórias",
    
    // Hero
    "hero.title": "Endereços de Email Temporário Instantâneos",
    "hero.subtitle": "Endereços de email descartáveis gratuitos, privados e anônimos. Sem cadastro necessário. Proteja sua caixa de entrada real do spam.",
    "hero.badge.free": "100% Gratuito",
    "hero.badge.anonymous": "Anônimo",
    "hero.badge.instant": "Configuração Instantânea",
    "hero.trusted": "Confiável por mais de 100.000 usuários em todo o mundo",
    
    // Email Generator
    "email.title": "Seu Email Temporário",
    "email.copy": "Copiar",
    "email.copied": "Copiado!",
    "email.generate": "Gerar novo email",
    "email.burn": "Queimar e gerar",
    "email.delete": "Deletar tudo",
    "email.qr": "Código QR",
    "email.notifications": "Receba notificações de novos emails",
    "email.enable": "Ativar",
    "email.dismiss": "Descartar",
    
    // Footer
    "footer.brand": "Endereços de email temporário gratuitos para proteção de privacidade anônima e descartável.",
    "footer.product": "Produto",
    "footer.legal": "Legal",
    "footer.contact": "Contato",
    "footer.temp.email": "Email Temporário",
    "footer.extension": "Extensão do Navegador",
    "footer.blog": "Blog e Guias",
    "footer.stories": "Histórias de Sucesso",
    "footer.terms": "Termos e Condições",
    "footer.privacy": "Política de Privacidade",
    "footer.copyright": "Todos os direitos reservados. Sua privacidade é nossa prioridade.",
    "footer.free": "100% Gratuito",
    "footer.anonymous": "Anônimo",
    "footer.nosignup": "Sem Cadastro",
    
    // Trust Section
    "trust.title": "Privacidade Integrada",
    "trust.subtitle": "Sem compromissos. Sem portas traseiras. Apenas proteção de privacidade pura apoiada por transparência e segurança.",
    "trust.metric.emails": "Emails Processados",
    "trust.metric.users": "Usuários Ativos",
    "trust.metric.uptime": "SLA de Tempo de Atividade",
    "trust.item1.title": "Sem Rastreamento",
    "trust.item1.subtitle": "Zero registros — não podemos acessar sua caixa de entrada.",
    "trust.item1.details": "Não coletamos, armazenamos nem analisamos seus dados",
    "trust.item2.title": "Segurança Criptográfica",
    "trust.item2.subtitle": "Criptografia de nível militar em cada solicitação.",
    "trust.item2.details": "A criptografia de ponta a ponta protege suas comunicações",
    "trust.item3.title": "Sem Armazenamento de Dados",
    "trust.item3.subtitle": "Emails deletam automaticamente — nada armazenado.",
    "trust.item3.details": "Todos os emails são deletados permanentemente após 24 horas",
    
    // FAQ
    "faq.title": "Perguntas Frequentes",
    "faq.subtitle": "Tudo que você precisa saber sobre Burner Email e serviços de email temporário",
    
    // Blog
    "blog.title": "Blog e Guias",
    "blog.subtitle": "Guias de especialistas sobre email temporário, proteção de privacidade e melhores práticas de segurança de email",
    "blog.search": "Pesquisar artigos por tópico, palavra-chave...",
    "blog.sort": "Ordenar por:",
    "blog.latest": "Mais Recentes",
    "blog.trending": "Tendências",
    "blog.indepth": "Aprofundado",
    "blog.back": "Voltar ao Início",
  },
  fr: {
    // Header
    "nav.home": "Accueil",
    "nav.blog": "Blog",
    "nav.stories": "Histoires",
    
    // Hero
    "hero.title": "Adresses Email Temporaires Instantanées",
    "hero.subtitle": "Adresses email jetables gratuites, privées et anonymes. Aucune inscription requise. Protégez votre boîte de réception réelle du spam.",
    "hero.badge.free": "100% Gratuit",
    "hero.badge.anonymous": "Anonyme",
    "hero.badge.instant": "Configuration Instantanée",
    "hero.trusted": "Approuvé par plus de 100 000 utilisateurs dans le monde",
    
    // Email Generator
    "email.title": "Votre Email Temporaire",
    "email.copy": "Copier",
    "email.copied": "Copié !",
    "email.generate": "Générer un nouvel email",
    "email.burn": "Brûler et générer",
    "email.delete": "Tout supprimer",
    "email.qr": "Code QR",
    "email.notifications": "Recevez des notifications pour les nouveaux emails",
    "email.enable": "Activer",
    "email.dismiss": "Fermer",
    
    // Footer
    "footer.brand": "Adresses email temporaires gratuites pour la protection de la vie privée anonyme et jetable.",
    "footer.product": "Produit",
    "footer.legal": "Légal",
    "footer.contact": "Contact",
    "footer.temp.email": "Email Temporaire",
    "footer.extension": "Extension du Navigateur",
    "footer.blog": "Blog et Guides",
    "footer.stories": "Histoires de Réussite",
    "footer.terms": "Conditions Générales",
    "footer.privacy": "Politique de Confidentialité",
    "footer.copyright": "Tous droits réservés. Votre confidentialité est notre priorité.",
    "footer.free": "100% Gratuit",
    "footer.anonymous": "Anonyme",
    "footer.nosignup": "Pas d'Inscription",
    
    // Trust Section
    "trust.title": "Confidentialité Intégrée",
    "trust.subtitle": "Aucun compromis. Pas de portes dérobées. Juste une protection de la vie privée pure soutenue par la transparence et la sécurité.",
    "trust.metric.emails": "Emails Traités",
    "trust.metric.users": "Utilisateurs Actifs",
    "trust.metric.uptime": "SLA de Disponibilité",
    "trust.item1.title": "Pas de Suivi",
    "trust.item1.subtitle": "Zéro journal — nous ne pouvons pas accéder à votre boîte de réception.",
    "trust.item1.details": "Nous ne collectons, ne stockons ni n'analysons vos données",
    "trust.item2.title": "Sécurité Cryptographique",
    "trust.item2.subtitle": "Chiffrement de niveau militaire dans chaque demande.",
    "trust.item2.details": "Le chiffrement de bout en bout protège vos communications",
    "trust.item3.title": "Pas de Stockage de Données",
    "trust.item3.subtitle": "Les emails se suppriment automatiquement — rien de stocké.",
    "trust.item3.details": "Tous les emails sont supprimés définitivement après 24 heures",
    
    // FAQ
    "faq.title": "Questions Fréquemment Posées",
    "faq.subtitle": "Tout ce que vous devez savoir sur Burner Email et les services d'email temporaire",
    
    // Blog
    "blog.title": "Blog et Guides",
    "blog.subtitle": "Guides d'experts sur les emails temporaires, la protection de la vie privée et les meilleures pratiques de sécurité des emails",
    "blog.search": "Rechercher des articles par sujet, mot-clé...",
    "blog.sort": "Trier par:",
    "blog.latest": "Récents",
    "blog.trending": "Tendances",
    "blog.indepth": "Approfondi",
    "blog.back": "Retour à l'Accueil",
  },
  de: {
    // Header
    "nav.home": "Startseite",
    "nav.blog": "Blog",
    "nav.stories": "Geschichten",
    
    // Hero
    "hero.title": "Sofortige Wegwerf-E-Mail-Adressen",
    "hero.subtitle": "Kostenlose, private und wegwerfbare E-Mail-Adressen. Keine Anmeldung erforderlich. Schützen Sie Ihren echten Posteingang vor Spam.",
    "hero.badge.free": "100% Kostenlos",
    "hero.badge.anonymous": "Anonym",
    "hero.badge.instant": "Sofortige Einrichtung",
    "hero.trusted": "Vertraut von über 100.000 Benutzern weltweit",
    
    // Email Generator
    "email.title": "Ihre temporäre E-Mail",
    "email.copy": "Kopieren",
    "email.copied": "Kopiert!",
    "email.generate": "Neue E-Mail generieren",
    "email.burn": "Verbrennen und generieren",
    "email.delete": "Alles löschen",
    "email.qr": "QR-Code",
    "email.notifications": "Benachrichtigungen für neue E-Mails erhalten",
    "email.enable": "Aktivieren",
    "email.dismiss": "Verwerfen",
    
    // Footer
    "footer.brand": "Kostenlose temporäre E-Mail-Adressen für anonymen, wegwerfbaren Datenschutz.",
    "footer.product": "Produkt",
    "footer.legal": "Rechtlich",
    "footer.contact": "Kontakt",
    "footer.temp.email": "Temporäre E-Mail",
    "footer.extension": "Browser-Erweiterung",
    "footer.blog": "Blog und Leitfäden",
    "footer.stories": "Erfolgsgeschichten",
    "footer.terms": "Allgemeine Geschäftsbedingungen",
    "footer.privacy": "Datenschutzrichtlinie",
    "footer.copyright": "Alle Rechte vorbehalten. Ihre Privatsphäre ist unsere Priorität.",
    "footer.free": "100% Kostenlos",
    "footer.anonymous": "Anonym",
    "footer.nosignup": "Keine Anmeldung",
    
    // Trust Section
    "trust.title": "Datenschutz Eingebaut",
    "trust.subtitle": "Keine Kompromisse. Keine Hintertüren. Nur reiner Datenschutz, gestützt durch Transparenz und Sicherheit.",
    "trust.metric.emails": "E-Mails verarbeitet",
    "trust.metric.users": "Aktive Benutzer",
    "trust.metric.uptime": "Verfügbarkeitszusage",
    "trust.item1.title": "Keine Verfolgung",
    "trust.item1.subtitle": "Null Protokolle — wir können nicht auf Ihren Posteingang zugreifen.",
    "trust.item1.details": "Wir erfassen, speichern oder analysieren Ihre Daten nicht",
    "trust.item2.title": "Kryptographische Sicherheit",
    "trust.item2.subtitle": "Militärische Verschlüsselung in jeder Anfrage.",
    "trust.item2.details": "Ende-zu-Ende-Verschlüsselung schützt Ihre Kommunikation",
    "trust.item3.title": "Keine Datenspeicherung",
    "trust.item3.subtitle": "E-Mails löschen sich automatisch — nichts wird gespeichert.",
    "trust.item3.details": "Alle E-Mails werden nach 24 Stunden dauerhaft gelöscht",
    
    // FAQ
    "faq.title": "Häufig Gestellte Fragen",
    "faq.subtitle": "Alles, was Sie über Burner Email und Dienste für temporäre E-Mails wissen müssen",
    
    // Blog
    "blog.title": "Blog und Leitfäden",
    "blog.subtitle": "Expertenleitfäden zu temporären E-Mails, Datenschutzschutz und Best Practices für E-Mail-Sicherheit",
    "blog.search": "Nach Thema, Stichwort suchen...",
    "blog.sort": "Sortieren nach:",
    "blog.latest": "Neueste",
    "blog.trending": "Trends",
    "blog.indepth": "Tiefgreifend",
    "blog.back": "Zurück zur Startseite",
  },
  hi: {
    // Header
    "nav.home": "होम",
    "nav.blog": "ब्लॉग",
    "nav.stories": "कहानियां",
    
    // Hero
    "hero.title": "तुरंत डिस्पोजेबल ईमेल पते",
    "hero.subtitle": "मुफ्त, निजी और डिस्पोजेबल ईमेल पते। कोई पंजीकरण आवश्यक नहीं। अपने असली इनबॉक्स को स्पैम से सुरक्षित रखें।",
    "hero.badge.free": "100% मुफ्त",
    "hero.badge.anonymous": "गुमनाम",
    "hero.badge.instant": "तुरंत सेटअप",
    "hero.trusted": "दुनिया भर के 100,000+ उपयोगकर्ताओं द्वारा विश्वसनीय",
    
    // Email Generator
    "email.title": "आपका अस्थायी ईमेल",
    "email.copy": "कॉपी करें",
    "email.copied": "कॉपी किया गया!",
    "email.generate": "नया ईमेल जनरेट करें",
    "email.burn": "जलाएं और जनरेट करें",
    "email.delete": "सब हटाएं",
    "email.qr": "QR कोड",
    "email.notifications": "नए ईमेल की सूचनाएं प्राप्त करें",
    "email.enable": "सक्षम करें",
    "email.dismiss": "खारिज करें",
    
    // Footer
    "footer.brand": "गुमनाम, डिस्पोजेबल गोपनीयता सुरक्षा के लिए मुफ्त अस्थायी ईमेल पते।",
    "footer.product": "उत्पाद",
    "footer.legal": "कानूनी",
    "footer.contact": "संपर्क",
    "footer.temp.email": "अस्थायी ईमेल",
    "footer.extension": "ब्राउजर एक्सटेंशन",
    "footer.blog": "ब्लॉग और गाइड",
    "footer.stories": "सफलता की कहानियां",
    "footer.terms": "नियम और शर्तें",
    "footer.privacy": "गोपनीयता नीति",
    "footer.copyright": "सर्वाधिकार सुरक्षित। आपकी गोपनीयता हमारी प्राथमिकता है।",
    "footer.free": "100% मुफ्त",
    "footer.anonymous": "गुमनाम",
    "footer.nosignup": "कोई साइनअप नहीं",
    
    // Trust Section
    "trust.title": "गोपनीयता अंतर्निहित",
    "trust.subtitle": "कोई समझौता नहीं। कोई बैकडोर नहीं। सिर्फ शुद्ध गोपनीयता सुरक्षा जो पारदर्शिता और सुरक्षा द्वारा समर्थित है।",
    "trust.metric.emails": "ईमेल प्रसंस्कृत",
    "trust.metric.users": "सक्रिय उपयोगकर्ता",
    "trust.metric.uptime": "अपटाइम SLA",
    "trust.item1.title": "कोई ट्रैकिंग नहीं",
    "trust.item1.subtitle": "शून्य लॉग — हम आपके इनबॉक्स तक नहीं पहुंच सकते।",
    "trust.item1.details": "हम आपके डेटा को एकत्र, संग्रहीत या विश्लेषण नहीं करते",
    "trust.item2.title": "क्रिप्टोग्राफिक सुरक्षा",
    "trust.item2.subtitle": "हर अनुरोध में सैन्य-ग्रेड एन्क्रिप्शन।",
    "trust.item2.details": "एंड-टू-एंड एन्क्रिप्शन आपके संचार की रक्षा करता है",
    "trust.item3.title": "कोई डेटा संग्रहण नहीं",
    "trust.item3.subtitle": "ईमेल स्वचालित रूप से हटा दिए जाते हैं — कुछ भी संग्रहीत नहीं।",
    "trust.item3.details": "सभी ईमेल 24 घंटे के बाद स्थायी रूप से हटा दिए जाते हैं",
    
    // FAQ
    "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
    "faq.subtitle": "Burner Email और अस्थायी ईमेल सेवाओं के बारे में आपको जो कुछ जानना चाहिए",
    
    // Blog
    "blog.title": "ब्लॉग और गाइड",
    "blog.subtitle": "अस्थायी ईमेल, गोपनीयता सुरक्षा और ईमेल सुरक्षा सर्वोत्तम प्रथाओं पर विशेषज्ञ गाइड",
    "blog.search": "विषय, कीवर्ड द्वारा लेख खोजें...",
    "blog.sort": "इसके अनुसार सॉर्ट करें:",
    "blog.latest": "नवीनतम",
    "blog.trending": "ट्रेंडिंग",
    "blog.indepth": "गहन",
    "blog.back": "होम पर वापस जाएं",
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
};
