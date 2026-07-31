/* =============================================
   Annexe HTML5 - Script Vue.js externe
   ============================================= */
const categoryOrder = [
  'Attributs Globaux',
  'Structure & Racine',
  'Métadonnées & En-tête',
  'Conteneurs & Blocs',
  'Balises Sémantiques',
  'Texte',
  'Listes',
  'Multimédia',
  'Tableaux',
  'Formulaires & Saisie',
  'Événements HTML5'];

const { createApp } = Vue;
createApp({
  data() {
    return {
      isDarkMode: false,
      searchQuery: '',
      selectedCategory: 'ALL',
      selectedTocItemId: localStorage.getItem('html5_last_selected_item') || null,
      items: [],
      activeAttr: {},
      activeModalItem: null
    };
  },
  async created() {
    try {
      const response = await fetch('jsons/html5.json');
      this.items = await response.json();
      const hashId = this.getHashItemId();
      const initialId = (hashId && this.items.some(i => i.id === hashId)) ? hashId : null;
      if (initialId) {
        this.$nextTick(() => {
          this.selectTocItem(initialId, false);
        });
      }
    } catch (e) {
      console.error('Erreur lors du chargement de jsons/html5.json:', e);
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
        localStorage.setItem('html5_last_selected_item', newId);
      } else {
        localStorage.removeItem('html5_last_selected_item');
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
          const attrMatch = item.attrsDetail && item.attrsDetail.some(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
          return nameMatch || offMatch || simMatch || attrMatch;
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
            if (a.id === 'input-all-attrs-summary') return -1;
            if (b.id === 'input-all-attrs-summary') return 1;
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
      allCats.forEach((cat, idx) => {
        if (idx % 2 === 0) {
          col1[cat] = this.groupedItems[cat];
        } else {
          col2[cat] = this.groupedItems[cat];
        }
      });
      return { col1, col2 };
    },
    displayOrderedItems() {
      const items = [];
      const groups = this.groupedItems;
      Object.keys(groups).forEach(cat => {
        Object.keys(groups[cat]).forEach(subcat => {
          items.push(...groups[cat][subcat]);
        });
      });
      return items;
    },
    currentModalIndex() {
      if (!this.activeModalItem) return -1;
      return this.displayOrderedItems.findIndex(i => i.id === this.activeModalItem.id);
    },
    hasPrevModalItem() {
      return this.currentModalIndex > 0;
    },
    hasNextModalItem() {
      return this.currentModalIndex >= 0 && this.currentModalIndex < this.displayOrderedItems.length - 1;
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
        const item = this.displayOrderedItems[this.currentModalIndex - 1];
        this.openModal(item);
      }
    },
    nextModalItem() {
      if (this.hasNextModalItem) {
        const item = this.displayOrderedItems[this.currentModalIndex + 1];
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
    selectAttribute(itemId, attrName, viewType) {
      if (this.activeAttr[itemId] === attrName) {
        this.activeAttr[itemId] = null;
        return;
      }
      const elementId = (viewType === 'grid' ? 'attr-table-grid-' : 'attr-table-acc-') + itemId;
      const collapseEl = document.getElementById(elementId);
      if (collapseEl) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        bsCollapse.show();
      }
      this.activeAttr[itemId] = attrName;
      this.$nextTick(() => {
        const rowId = 'row-attr-' + (viewType === 'grid' ? 'grid-' : 'acc-') + itemId + '-' + attrName;
        const rowEl = document.getElementById(rowId);
        if (rowEl) {
          rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    isAttrSelected(itemId, attrName) {
      return this.activeAttr[itemId] === attrName;
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
    },
    copy(text) {
      navigator.clipboard.writeText(text).then(() => alert('Code HTML copié !'));
    },
    highlight(text) {
      if (!this.searchQuery || !text) return text;
      const q = this.searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    },
    syntaxHighlightTag(tagName) {
      if (!tagName) return '';
      let escaped = tagName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let text = this.highlight(escaped);
      return text
        .replace(/&lt;/g, '<span class="syn-bracket">&lt;</span>')
        .replace(/&gt;/g, '<span class="syn-bracket">&gt;</span>')
        .replace(/(<span class="syn-bracket">&lt;<\/span>)([a-zA-Z0-9!/-]+)/g, '$1<span class="syn-tag">$2</span>');
    },
    formatTableTagName(tagName) {
      if (!tagName) return '';
      if (tagName.includes('type=')) {
        const match = tagName.match(/^<([a-zA-Z0-9]+)\s+type="(.*?)"\/?>$/);
        if (match) {
          const tag = match[1];
          const types = match[2];
          return `<span class="syn-bracket">&lt;</span><span class="syn-tag">${tag}</span><span class="syn-bracket">&gt;</span><div class="text-muted font-monospace fw-normal" style="font-size:0.7rem; line-height:1.25; margin-top:2px; word-break:break-word;"><span class="syn-attr">type</span>=<span class="syn-val">"${types}"</span></div>`;
        }
      }
      return this.syntaxHighlightTag(tagName);
    },
    formatCodeSnippet(code) {
      if (!code) return '';
      let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      escaped = escaped.replace(/&lt;!--[\s\S]*?--&gt;/g, function (m) {
        return '<span class="syn-comment">' + m + '</span>';
      });
      escaped = escaped.replace(/&lt;(\/?[a-zA-Z0-9!-]+)([\s\S]*?)&gt;/g, function (full, tagName, rest) {
        let attrMatches = rest.match(/([a-zA-Z-]+)=(".*?"|'.*?'|&quot;.*?&quot;)/g);
        if (attrMatches && attrMatches.length >= 2 && !rest.includes('\n')) {
          rest = '\n  ' + rest.trim().replace(/\s+([a-zA-Z-]+)=/g, '\n  $1=');
        }
        let formattedRest = rest.replace(/([a-zA-Z-]+)=(".*?"|'.*?'|&quot;.*?&quot;)/g,
          '<span class="syn-attr">$1</span>=<span class="syn-val">$2</span>'
        );
        return '<span class="syn-bracket">&lt;</span><span class="syn-tag">' + tagName + '</span>' + formattedRest + '<span class="syn-bracket">&gt;</span>';
      });
      return escaped;
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
