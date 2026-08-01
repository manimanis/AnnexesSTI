/* =============================================
   Annexe SQL - Script Vue.js externe
   ============================================= */
const categoryOrder = [
  'Interrogation de Données (DQL)',
  'Manipulation de Données (DML)',
  'Définition de Données (DDL)',
  'Contraintes d\'Intégrité',
  'Filtres & Conditions (WHERE)',
  'Jointures & Sous-requêtes',
  'Fonctions SQL & Agrégats',
  'Types de Données SQL',
  'Concepts & Structure BDR'];

const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

createApp({
  setup() {
    const isDarkMode = ref(false);
    const searchQuery = ref('');
    const selectedCategory = ref('ALL');
    const selectedTocItemId = ref(localStorage.getItem('sql_last_selected_item') || null);
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
        const response = await fetch('jsons/sql.json');
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
        console.error('Erreur lors du chargement de jsons/sql.json:', e);
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
        localStorage.setItem('sql_last_selected_item', newId);
      } else {
        localStorage.removeItem('sql_last_selected_item');
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
        Object.keys(groups[cat]).forEach(subcat => {
          sortedGroups[cat][subcat] = groups[cat][subcat];
        });
      });
      return sortedGroups;
    });

    const groupedItemsColumns = computed(() => {
      const allCats = Object.keys(groupedItems.value);
      const col1 = {};
      const col2 = {};
      let count1 = 0;
      let count2 = 0;

      allCats.forEach(cat => {
        const catCount = getCategoryCount(groupedItems.value[cat]);
        const catWeight = catCount + 3;
        if (count1 <= count2) {
          col1[cat] = groupedItems.value[cat];
          count1 += catWeight;
        } else {
          col2[cat] = groupedItems.value[cat];
          count2 += catWeight;
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
      // Access DOM using template refs (using getElementById is kept here temporarily until refs are added to HTML)
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
      navigator.clipboard.writeText(text).then(() => alert('Commande SQL copié !'));
    };

    const highlight = (text) => {
      if (!searchQuery.value || !text) return text;
      const q = searchQuery.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    };

    const formatSqlName = (name) => {
      if (!name) return '';
      let text = highlight(name);
      if (name.includes('(') && !name.includes('SELECT')) {
        return `<span class="syn-fn">${text}</span>`;
      }
      return `<span class="syn-kw">${text}</span>`;
    };

    const formatCodeSnippet = (code) => {
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
      formatSqlName,
      formatCodeSnippet,
      getPedagoClass,
      getPedagoIcon,
      getPedagoTitle
    };
  }
}).mount('#app');
