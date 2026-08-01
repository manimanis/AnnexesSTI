/* =============================================
   Annexe JavaScript - Script Vue.js externe
   ============================================= */
const categoryOrder = [
  'Opérateurs Logiques',
  'Entrées & Sorties',
  'Manipulation de Chaînes (String)',
  'Conversion de Types (Casting)',
  'Fonctions Mathématiques (Math)',
  'Date et Heure (Date)',
  'Propriétés & Méthodes Spécifiques',
  'Événements JavaScript',
  'Gestion du DOM'
];

const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

createApp({
  setup() {
    const isDarkMode = ref(false);
    const searchQuery = ref('');
    const selectedCategory = ref('ALL');
    const selectedTocItemId = ref(localStorage.getItem('js_last_selected_item') || null);
    const items = ref([]);
    const activeModalItem = ref(null);
    const fuse = ref(null);

    const getHashItemId = () => {
      const hash = window.location.hash;
      if (!hash) return null;
      return hash.replace(/^#(item-)?/, '') || null;
    };

    onMounted(async () => {
      try {
        const response = await fetch('jsons/js.json');
        items.value = await response.json();

        fuse.value = new Fuse(items.value, {
          keys: ['name', 'syntax', 'official', 'simple', 'note', 'params.name', 'params.desc'],
          threshold: 0.3,
          ignoreLocation: true
        });

        const hashId = getHashItemId();
        const initialId = (hashId && items.value.some(i => i.id === hashId)) ? hashId : null;
        if (initialId) {
          nextTick(() => {
            selectTocItem(initialId, false);
          });
        }
      } catch (e) {
        console.error('Erreur lors du chargement de jsons/js.json:', e);
      }

      window.addEventListener('hashchange', () => {
        const hashId = getHashItemId();
        if (hashId && items.value.some(i => i.id === hashId)) {
          selectTocItem(hashId, false);
        }
      });

      window.addEventListener('keydown', (e) => {
        const modalEl = document.getElementById('itemDetailModal');
        if (modalEl && modalEl.classList.contains('show')) {
          if (e.key === 'ArrowLeft') {
            prevModalItem();
          } else if (e.key === 'ArrowRight') {
            nextModalItem();
          }
        }
      });
    });

    watch(selectedTocItemId, (newId) => {
      if (newId) {
        localStorage.setItem('js_last_selected_item', newId);
      } else {
        localStorage.removeItem('js_last_selected_item');
      }
    });

    const categories = computed(() => {
      const uniqueCats = Array.from(new Set(items.value.map(i => i.category)));
      uniqueCats.sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b, 'fr', { sensitivity: 'base' });
      });
      return uniqueCats;
    });

    const filteredItems = computed(() => {
      let result = items.value;
      if (searchQuery.value.trim() !== '' && fuse.value) {
        result = fuse.value.search(searchQuery.value).map(res => res.item);
      }
      if (selectedCategory.value !== 'ALL') {
        result = result.filter(item => item.category === selectedCategory.value);
      }
      return result;
    });

    const groupedItems = computed(() => {
      const groups = {};
      filteredItems.value.forEach(item => {
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
    });

    const groupedItemsColumns = computed(() => {
      const allCats = Object.keys(groupedItems.value);
      const col1 = {};
      const col2 = {};
      allCats.forEach((cat, idx) => {
        if (idx % 2 === 0) {
          col1[cat] = groupedItems.value[cat];
        } else {
          col2[cat] = groupedItems.value[cat];
        }
      });
      return { col1, col2 };
    });

    const displayOrderedItems = computed(() => {
      const allItems = [];
      const groups = groupedItems.value;
      Object.keys(groups).forEach(cat => {
        Object.keys(groups[cat]).forEach(subcat => {
          allItems.push(...groups[cat][subcat]);
        });
      });
      return allItems;
    });

    const currentModalIndex = computed(() => {
      if (!activeModalItem.value) return -1;
      return displayOrderedItems.value.findIndex(i => i.id === activeModalItem.value.id);
    });

    const hasPrevModalItem = computed(() => currentModalIndex.value > 0);
    const hasNextModalItem = computed(() => currentModalIndex.value >= 0 && currentModalIndex.value < displayOrderedItems.value.length - 1);

    const prevModalItem = () => {
      if (hasPrevModalItem.value) {
        const item = displayOrderedItems.value[currentModalIndex.value - 1];
        openModal(item);
      }
    };

    const nextModalItem = () => {
      if (hasNextModalItem.value) {
        const item = displayOrderedItems.value[currentModalIndex.value + 1];
        openModal(item);
      }
    };

    const openModal = (item) => {
      if (!item) return;
      activeModalItem.value = item;
      selectedTocItemId.value = item.id;
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
      nextTick(() => {
        const modalEl = document.getElementById('itemDetailModal');
        if (modalEl) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      });
    };

    const closeModal = () => {
      const modalEl = document.getElementById('itemDetailModal');
      if (modalEl) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
    };

    const selectTocItem = (itemId, updateHash = true) => {
      selectedTocItemId.value = itemId;
      const itemObj = items.value.find(i => i.id === itemId);
      if (itemObj) {
        openModal(itemObj);
      }
    };

    const getCategoryCount = (subGroups) => {
      if (!subGroups) return 0;
      return Object.values(subGroups).reduce((acc, arr) => acc + arr.length, 0);
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.setAttribute('data-bs-theme', isDarkMode.value ? 'dark' : 'light');
    };

    const copy = (text) => {
      navigator.clipboard.writeText(text).then(() => alert('Code JavaScript copié !'));
    };

    const highlight = (text) => {
      if (!searchQuery.value || !text) return text;
      const q = searchQuery.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    };

    const formatJsName = (name) => {
      if (!name) return '';
      let text = highlight(name);
      if (name.includes('(') || name.includes('.')) {
        return `<span class="syn-obj">${text}</span>`;
      }
      return `<span class="syn-kw">${text}</span>`;
    };

    const formatCodeSnippet = (code) => {
      if (!code) return '';
      let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const jsRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)|(".*?"|'.*?'|`[\s\S]*?`)|(\b(?:let|var|const|function|if|else|return|for|while|new|class|import|export|true|false|null|typeof|instanceof)\b)|(\b(?:document|window|Math|Date|Array|String|Number|Object|console|alert|prompt|confirm)\b)|(\b\d+\b)/g;

      return escaped.replace(jsRegex, (match, comment, str, kw, obj, num) => {
        if (comment) return `<span class="syn-comment">${comment}</span>`;
        if (str) return `<span class="syn-str">${str}</span>`;
        if (kw) return `<span class="syn-kw">${kw}</span>`;
        if (obj) return `<span class="syn-obj">${obj}</span>`;
        if (num) return `<span class="syn-num">${num}</span>`;
        return match;
      });
    };

    const getPedagoClass = (type) => {
      if (type === 'remember') return 'pedago-remember';
      if (type === 'warning') return 'pedago-warning';
      return 'pedago-tip';
    };

    const getPedagoIcon = (type) => {
      if (type === 'remember') return 'bi-bookmark-check-fill text-info';
      if (type === 'warning') return 'bi-exclamation-triangle-fill text-warning';
      return 'bi-lightbulb-fill text-success';
    };

    const getPedagoTitle = (type) => {
      if (type === 'remember') return 'À retenir pour le Bac';
      if (type === 'warning') return 'Attention aux Pièges';
      return 'Conseil pratique';
    };

    return {
      isDarkMode,
      searchQuery,
      selectedCategory,
      selectedTocItemId,
      items,
      activeModalItem,
      categories,
      filteredItems,
      groupedItems,
      groupedItemsColumns,
      displayOrderedItems,
      currentModalIndex,
      hasPrevModalItem,
      hasNextModalItem,
      getHashItemId,
      prevModalItem,
      nextModalItem,
      openModal,
      closeModal,
      selectTocItem,
      getCategoryCount,
      toggleTheme,
      copy,
      highlight,
      formatJsName,
      formatCodeSnippet,
      getPedagoClass,
      getPedagoIcon,
      getPedagoTitle
    };
  }
}).mount('#app');
