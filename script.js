/* ══════════════════════════════════════════
   script.js — Portail Étudiant UB2
   Université Batna 2 Mostefa Ben Boulaïd
   ══════════════════════════════════════════ */


/* ════════════════════════════════════════
   1. NAVIGATION ENTRE PAGES
   ════════════════════════════════════════
   Chaque .nav-item a un attribut data-page="nom"
   Chaque section de page a l'id "page-nom"
   En cliquant sur un nav-item, on :
     - retire .active de tous les .page
     - retire .active de tous les .nav-item
     - ajoute .active à la page cible
     - ajoute .active au nav-item cliqué
*/
function showPage(pageId) {
  /* Cacher toutes les pages */
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  /* Désactiver tous les items de nav */
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.classList.remove('active');
  });

  /* Afficher la page cible */
  var targetPage = document.getElementById('page-' + pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  /* Activer le bon nav-item */
  var targetNav = document.querySelector('.nav-item[data-page="' + pageId + '"]');
  if (targetNav) {
    targetNav.classList.add('active');
  }
}

/* Attacher les clics sur les items de la sidebar */
document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
  item.addEventListener('click', function() {
    showPage(this.getAttribute('data-page'));
  });
});

/* Raccourcis de l'accueil (quick-cards) */
document.querySelectorAll('.quick-card[data-goto]').forEach(function(card) {
  card.addEventListener('click', function() {
    showPage(this.getAttribute('data-goto'));
  });
});


/* ════════════════════════════════════════
   2. BOUTONS SEMESTRE (onglets)
   ════════════════════════════════════════
   Les groupes de .sem-btn à l'intérieur
   d'un même parent partagent l'état actif.
*/
document.querySelectorAll('.sem-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    /* Trouver tous les sem-btn du même parent */
    var siblings = this.parentElement.querySelectorAll('.sem-btn');
    siblings.forEach(function(s) { s.classList.remove('active'); });
    this.classList.add('active');
  });
});


/* ════════════════════════════════════════
   3. NOTIFICATION (cloche)
   ════════════════════════════════════════
   Un simple toggle pour simuler la lecture
   des notifications.
*/
var notifBtn = document.querySelector('.notif-btn');
var notifDot = document.querySelector('.notif-dot');

if (notifBtn && notifDot) {
  notifBtn.addEventListener('click', function() {
    /* Masquer le point rouge après le clic */
    notifDot.style.display = notifDot.style.display === 'none' ? 'block' : 'none';
    /* Ici tu pourras plus tard ouvrir un panneau de notifications */
  });
}


/* ════════════════════════════════════════
   4. MARQUER LES MESSAGES COMME LUS
   ════════════════════════════════════════
   Un clic sur un message retire la classe
   "unread" et cache le point bleu.
*/
document.querySelectorAll('.msg-item').forEach(function(msg) {
  msg.addEventListener('click', function() {
    this.classList.remove('unread');
    var dot = this.querySelector('.unread-dot');
    if (dot) { dot.style.display = 'none'; }

    /* Mettre à jour le badge de la nav */
    updateMsgBadge();
  });
});

function updateMsgBadge() {
  var unreads = document.querySelectorAll('.msg-item.unread').length;
  var badge = document.querySelector('.nav-item[data-page="messages"] .nav-badge');
  if (badge) {
    if (unreads > 0) {
      badge.textContent = unreads;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
}


/* ════════════════════════════════════════
   5. BOUTONS TÉLÉCHARGER / OUVRIR
   ════════════════════════════════════════
   Simulation d'un retour visuel au clic.
   À remplacer par de vraies URL de fichiers.
*/
document.querySelectorAll('.btn-dl').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var original = this.textContent;
    this.textContent = '✓ OK';
    var self = this;
    setTimeout(function() {
      self.textContent = original;
    }, 1500);
  });
});


/* ════════════════════════════════════════
   6. ANIMATION DES BARRES DE PROGRESSION
   ════════════════════════════════════════
   Au chargement, les barres s'animent
   depuis 0 jusqu'à leur valeur cible.
*/
window.addEventListener('load', function() {
  /* Petite pause pour que le CSS soit prêt */
  setTimeout(function() {
    document.querySelectorAll('.progress-fill').forEach(function(fill) {
      var target = fill.style.width;
      fill.style.width = '0%';
      setTimeout(function() {
        fill.style.width = target;
      }, 100);
    });
  }, 200);
});


/* ════════════════════════════════════════
   7. MISE EN ÉVIDENCE DU JOUR ACTUEL
   ════════════════════════════════════════
   Récupère le jour de la semaine et met
   en valeur la colonne correspondante dans
   l'emploi du temps.
   (0=Dim, 1=Lun, 2=Mar, 3=Mer, 4=Jeu, 5=Ven)
*/
(function highlightToday() {
  var days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  var today = new Date().getDay(); /* 0 = Dimanche */

  /* La grille a : col 0 = heure, col 1 à 5 = Dim à Jeu */
  /* On cherche l'en-tête qui commence par le bon jour */
  var headers = document.querySelectorAll('.emp-header');
  headers.forEach(function(header) {
    var txt = header.textContent.trim().substring(0, 3);
    if (txt === days[today] || header.querySelector('.today-tag')) {
      header.style.background = '#E6F0FF';
      header.style.color = '#0C2D6B';
      header.style.fontWeight = '700';
    }
  });
})();


/* ════════════════════════════════════════
   8. DATE DYNAMIQUE DANS L'EMPLOI DU TEMPS
   ════════════════════════════════════════
   Met à jour le sous-titre avec la vraie
   semaine en cours.
*/
(function setWeekSubtitle() {
  var subtitle = document.querySelector('#page-emploi .page-subtitle');
  if (!subtitle) return;

  var now = new Date();

  /* Trouver le lundi de cette semaine */
  var day = now.getDay();
  var diff = now.getDate() - day + (day === 0 ? -6 : 1);
  var monday = new Date(now.setDate(diff));

  /* Trouver le vendredi */
  var friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  var opts = { day: 'numeric', month: 'long', year: 'numeric' };
  var locale = 'fr-FR';

  subtitle.textContent =
    'Semaine du ' +
    monday.toLocaleDateString(locale, { day: 'numeric', month: 'long' }) +
    ' au ' +
    friday.toLocaleDateString(locale, opts);
})();
/* ===== MENU MOBILE ===== */

const mobileBtn = document.querySelector('.mobile-menu-btn');

if(mobileBtn){

  mobileBtn.addEventListener('click', function(){

    document
      .querySelector('.sidebar')
      .classList
      .toggle('open');

  });

}

/* Fermer le menu après clic */

document.querySelectorAll('.nav-item').forEach(function(item){

  item.addEventListener('click', function(){

    if(window.innerWidth <= 640){

      document
        .querySelector('.sidebar')
        .classList
        .remove('open');

    }

  });

});