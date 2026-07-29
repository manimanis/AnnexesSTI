/* =============================================
   Annexe JavaScript - Script Vue.js externe
   ============================================= */
const categoryOrder = [
  'Opérateurs Logiques',
  'Entrées & Sorties',
  'Conversions & Types',
  'Manipulation du DOM',
  'Objet Math',
  'Chaînes de Caractères',
  'Objet Date',
  'Modification du DOM'
];

const { createApp } = Vue;
createApp({
  data() {
    return {
      isDarkMode: false,
      searchQuery: '',
      selectedCategory: 'ALL',
      viewMode: 'grid',
      selectedTocItemId: localStorage.getItem('js_last_selected_item') || null,
      items: []
    };
  },
  async created() {
    try {
      const response = await fetch('jsons/js.json');
      this.items = await response.json();
      const hashId = this.getHashItemId();
      const initialId = (hashId && this.items.some(i => i.id === hashId)) ? hashId : this.selectedTocItemId;
      if (initialId) {
        this.$nextTick(() => {
          this.selectTocItem(initialId, false);
        });
      }
    } catch (e) {
      console.error('Erreur lors du chargement de jsons/js.json:', e);
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      const hashId = this.getHashItemId();
      if (hashId && this.items.some(i => i.id === hashId)) {
        this.selectTocItem(hashId, false);
      }
    });
  },
  watch: {
    selectedTocItemId(newId) {
      if (newId) {
        localStorage.setItem('js_last_selected_item', newId);
      } else {
        localStorage.removeItem('js_last_selected_item');
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
    }
  },
  methods: {
    getHashItemId() {
      const hash = window.location.hash;
      if (!hash) return null;
      return hash.replace(/^#(item-)?/, '') || null;
    },
    selectTocItem(itemId, updateHash = true) {
      this.selectedTocItemId = itemId;
      if (updateHash && itemId) {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, '#item-' + itemId);
        } else {
          window.location.hash = 'item-' + itemId;
        }
      }
      this.$nextTick(() => {
        const collapseEl = document.getElementById('col-' + itemId);
        if (collapseEl) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
          bsCollapse.show();
        }
        const itemObj = this.items.find(i => i.id === itemId);
        if (itemObj && itemObj.category) {
          const catId = 'toc-col-' + itemObj.category.replace(/[^a-zA-Z0-9]/g, '');
          const tocCollapseEl = document.getElementById(catId);
          if (tocCollapseEl) {
            const bsTocCollapse = bootstrap.Collapse.getOrCreateInstance(tocCollapseEl, { toggle: false });
            bsTocCollapse.show();
          }
        }
        const targetEl = document.getElementById('item-' + itemId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
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
      navigator.clipboard.writeText(text).then(() => alert('Code JavaScript copié !'));
    },
    highlight(text) {
      if (!this.searchQuery || !text) return text;
      const q = this.searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    },
    formatJsName(name) {
      if (!name) return '';
      let escaped = name
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      let text = this.highlight(escaped);
      if (text.includes('.') || text.includes('()')) {
        return `<span class="syn-obj">${text}</span>`;
      }
      return `<span class="syn-kw">${text}</span>`;
    },
    formatCodeSnippet(code) {
      if (!code) return '';
      let text = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const tokenRegex = /(\/\/[^\n]*)|(".*?"|'.*?')|\b(let|const|var|if|else|while|for|return|new|function|true|false)\b|\b(document|getElementById|getElementsByName|Math|String|Number|parseInt|parseFloat|isNaN|alert|prompt|console)\b|\b(\d+)\b/g;

      return text.replace(tokenRegex, (match, comment, str, kw, obj, num) => {
        if (comment) return `<span class="syn-comment">${comment}</span>`;
        if (str) return `<span class="syn-str">${str}</span>`;
        if (kw) return `<span class="syn-kw">${kw}</span>`;
        if (obj) return `<span class="syn-obj">${obj}</span>`;
        if (num) return `<span class="syn-num">${num}</span>`;
        return match;
      });
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
