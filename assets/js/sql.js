/* =============================================
   Annexe SQL - Script Vue.js externe
   ============================================= */
const categoryOrder = [
  'Concepts & Structure BDR',
  'Types de Données SQL',
  'Définition de Données (DDL)',
  'Contraintes d\'Intégrité',
  'Manipulation de Données (DML)',
  'Interrogation de Données (DQL)',
  'Filtres & Conditions (WHERE)',
  'Jointures & Sous-requêtes',
  'Fonctions SQL & Agrégats'
];

const { createApp } = Vue;
createApp({
  data() {
    return {
      isDarkMode: false,
      searchQuery: '',
      selectedCategory: 'ALL',
      selectedTocItemId: localStorage.getItem('sql_last_selected_item') || null,
      items: [],
      activeModalItem: null
    };
  },
  async created() {
    try {
      const response = await fetch('jsons/sql.json');
      this.items = await response.json();
      const hashId = this.getHashItemId();
      const initialId = (hashId && this.items.some(i => i.id === hashId)) ? hashId : null;
      if (initialId) {
        this.$nextTick(() => {
          this.selectTocItem(initialId, false);
        });
      }
    } catch (e) {
      console.error('Erreur lors du chargement de jsons/sql.json:', e);
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      const hashId = this.getHashItemId();
      if (hashId && this.items.some(i => i.id === hashId)) {
        this.selectTocItem(hashId, false);
      }
    });
    window.addEventListener('keydown', (e) => {
      const modalEl = document.getElementById('itemDetailModal');
      if (modalEl && modalEl.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
          this.prevModalItem();
        } else if (e.key === 'ArrowRight') {
          this.nextModalItem();
        }
      }
    });
  },
  watch: {
    selectedTocItemId(newId) {
      if (newId) {
        localStorage.setItem('sql_last_selected_item', newId);
      } else {
        localStorage.removeItem('sql_last_selected_item');
      }
    }
  },
  computed: {
    categories() {
      const uniqueCats = Array.from(new Set(this.items.map(i => i.category)));
      uniqueCats.sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b, 'fr', { sensitivity: 'base' });
      });
      return uniqueCats;
    },
    filteredItems() {
      return this.items.filter(item => {
        if (this.selectedCategory !== 'ALL' && item.category !== this.selectedCategory) return false;
        if (this.searchQuery.trim() !== '') {
          const q = this.searchQuery.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(q);
          const offMatch = item.official.toLowerCase().includes(q);
          const simMatch = item.simple.toLowerCase().includes(q);
          const noteMatch = item.note && item.note.toLowerCase().includes(q);
          return nameMatch || offMatch || simMatch || noteMatch;
        }
        return true;
      });
    },
    groupedItems() {
      const groups = {};
      this.filteredItems.forEach(item => {
        const cat = item.category;
        const subcat = item.subcategory || '';
        if (!groups[cat]) groups[cat] = {};
        if (!groups[cat][subcat]) groups[cat][subcat] = [];
        groups[cat][subcat].push(item);
      });
      const sortedGroups = {};
      const catKeys = Object.keys(groups).sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b, 'fr', { sensitivity: 'base' });
      });
      catKeys.forEach(cat => {
        sortedGroups[cat] = {};
        Object.keys(groups[cat]).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })).forEach(subcat => {
          sortedGroups[cat][subcat] = groups[cat][subcat].sort((a, b) => {
            const nameA = a.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const nameB = b.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return nameA.localeCompare(nameB, 'fr', { sensitivity: 'base' });
          });
        });
      });
      return sortedGroups;
    },
    groupedItemsColumns() {
      const allCats = Object.keys(this.groupedItems);
      const col1 = {};
      const col2 = {};
      let count1 = 0;
      let count2 = 0;

      allCats.forEach(cat => {
        const catCount = this.getCategoryCount(this.groupedItems[cat]);
        const catWeight = catCount + 3;
        if (count1 <= count2) {
          col1[cat] = this.groupedItems[cat];
          count1 += catWeight;
        } else {
          col2[cat] = this.groupedItems[cat];
          count2 += catWeight;
        }
      });
      return { col1, col2 };
    },
    currentModalIndex() {
      if (!this.activeModalItem) return -1;
      return this.filteredItems.findIndex(i => i.id === this.activeModalItem.id);
    },
    hasPrevModalItem() {
      return this.currentModalIndex > 0;
    },
    hasNextModalItem() {
      return this.currentModalIndex >= 0 && this.currentModalIndex < this.filteredItems.length - 1;
    }
  },
  methods: {
    getHashItemId() {
      const hash = window.location.hash;
      if (!hash) return null;
      return hash.replace(/^#(item-)?/, '') || null;
    },
    prevModalItem() {
      if (this.hasPrevModalItem) {
        const item = this.filteredItems[this.currentModalIndex - 1];
        this.openModal(item);
      }
    },
    nextModalItem() {
      if (this.hasNextModalItem) {
        const item = this.filteredItems[this.currentModalIndex + 1];
        this.openModal(item);
      }
    },
    openModal(item) {
      if (!item) return;
      this.activeModalItem = item;
      this.selectedTocItemId = item.id;
      if (window.history && window.history.pushState) {
        history.pushState(null, null, '#item-' + item.id);
      } else {
        window.location.hash = 'item-' + item.id;
      }
      const offcanvasEl = document.getElementById('tocOffcanvas');
      if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
      this.$nextTick(() => {
        const modalEl = document.getElementById('itemDetailModal');
        if (modalEl) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      });
    },
    closeModal() {
      const modalEl = document.getElementById('itemDetailModal');
      if (modalEl) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
    },
    selectTocItem(itemId, updateHash = true) {
      this.selectedTocItemId = itemId;
      const itemObj = this.items.find(i => i.id === itemId);
      if (itemObj) {
        this.openModal(itemObj);
      }
    },
    getCategoryCount(subGroups) {
      if (!subGroups) return 0;
      return Object.values(subGroups).reduce((acc, arr) => acc + arr.length, 0);
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
    },
    copy(text) {
      navigator.clipboard.writeText(text).then(() => alert('Commande SQL copié !'));
    },
    highlight(text) {
      if (!this.searchQuery || !text) return text;
      const q = this.searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    },
    formatSqlName(name) {
      if (!name) return '';
      let text = this.highlight(name);
      if (name.includes('(') && !name.includes('SELECT')) {
        return `<span class="syn-fn">${text}</span>`;
      }
      return `<span class="syn-kw">${text}</span>`;
    },
    formatCodeSnippet(code) {
      if (!code) return '';
      let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const sqlRegex = /(--.*|\/\*[\s\S]*?\*\/)|(".*?"|'.*?')|(\b(?:COUNT|SUM|AVG|MAX|MIN|NOW|CURDATE|CURRENT_DATE|ADDDATE|DATE_ADD|DATEDIFF|YEAR|MONTH|DAY|CONCAT|SUBSTRING|SUBSTR|UPPER|LOWER|LENGTH|TRIM|ROUND|TRUNCATE|MOD|ABS)\b)|(\b(?:SELECT|DISTINCT|FROM|WHERE|INSERT|INTO|UPDATE|SET|DELETE|CREATE|DATABASE|USE|TABLE|ALTER|ADD|MODIFY|CHANGE|RENAME|ENABLE|DISABLE|KEYS|CONSTRAINT|DROP|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|JOIN|INNER|ON|GROUP|BY|HAVING|ORDER|ASC|DESC|AND|OR|NOT|IN|LIKE|BETWEEN|NULL|IS|INT|INTEGER|VARCHAR|CHAR|TEXT|DECIMAL|DATE|DATETIME|TIMESTAMP|AUTO_INCREMENT|DEFAULT|CHECK|UNIQUE|CASCADE|RESTRICT|SOURCE)\b)|(\b\d+\b)/gi;

      let res = escaped.replace(sqlRegex, (match, comment, str, fn, kw, num) => {
        if (comment) return `<span class="syn-comment">${match}</span>`;
        if (str) return `<span class="syn-str">${match}</span>`;
        if (fn) return `<span class="syn-fn">${match}</span>`;
        if (kw) return `<span class="syn-kw">${match}</span>`;
        if (num) return `<span class="syn-num">${match}</span>`;
        return match;
      });

      return res.replace(/&lt;u&gt;/gi, '<u>').replace(/&lt;\/u&gt;/gi, '</u>');
    },
    getPedagoClass(type) {
      if (type === 'remember') return 'pedago-remember';
      if (type === 'warning') return 'pedago-warning';
      return 'pedago-tip';
    },
    getPedagoIcon(type) {
      if (type === 'remember') return 'bi-bookmark-check-fill text-info';
      if (type === 'warning') return 'bi-exclamation-triangle-fill text-warning';
      return 'bi-lightbulb-fill text-success';
    },
    getPedagoTitle(type) {
      if (type === 'remember') return 'À retenir pour le Bac';
      if (type === 'warning') return 'Attention aux Pièges';
      return 'Conseil pratique';
    }
  }
}).mount('#app');
