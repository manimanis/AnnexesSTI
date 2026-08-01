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

const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

createApp({
  setup() {
    const isDarkMode = ref(false);
    const searchQuery = ref('');
    const selectedCategory = ref('ALL');
    const selectedTocItemId = ref(localStorage.getItem('html5_last_selected_item') || null);
    const items = ref([]);
    const activeAttr = ref({});
    const activeModalItem = ref(null);
    const fuse = ref(null);

    const getHashItemId = () => {
      const hash = window.location.hash;
      if (!hash) return null;
      return hash.replace(/^#(item-)?/, '') || null;
    };

    onMounted(async () => {
      try {
        const response = await fetch('jsons/html5.json');
        items.value = await response.json();

        fuse.value = new Fuse(items.value, {
          keys: ['name', 'official', 'simple', 'attrsDetail.name', 'attrsDetail.desc'],
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
        console.error('Erreur lors du chargement de jsons/html5.json:', e);
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
        localStorage.setItem('html5_last_selected_item', newId);
      } else {
        localStorage.removeItem('html5_last_selected_item');
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
            if (a.id === 'input-all-attrs-summary') return -1;
            if (b.id === 'input-all-attrs-summary') return 1;
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

    const selectAttribute = (itemId, attrName, viewType) => {
      if (activeAttr.value[itemId] === attrName) {
        activeAttr.value[itemId] = null;
        return;
      }
      const elementId = (viewType === 'grid' ? 'attr-table-grid-' : 'attr-table-acc-') + itemId;
      const collapseEl = document.getElementById(elementId);
      if (collapseEl) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        bsCollapse.show();
      }
      activeAttr.value[itemId] = attrName;
      nextTick(() => {
        const rowId = 'row-attr-' + (viewType === 'grid' ? 'grid-' : 'acc-') + itemId + '-' + attrName;
        const rowEl = document.getElementById(rowId);
        if (rowEl) {
          rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    };

    const isAttrSelected = (itemId, attrName) => {
      return activeAttr.value[itemId] === attrName;
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.setAttribute('data-bs-theme', isDarkMode.value ? 'dark' : 'light');
    };

    const copy = (text) => {
      navigator.clipboard.writeText(text).then(() => alert('Code HTML copié !'));
    };

    const highlight = (text) => {
      if (!searchQuery.value || !text) return text;
      const q = searchQuery.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="highlight-search">$1</mark>');
    };

    const syntaxHighlightTag = (tagName) => {
      if (!tagName) return '';
      let escaped = tagName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let text = highlight(escaped);
      return text
        .replace(/&lt;/g, '<span class="syn-bracket">&lt;</span>')
        .replace(/&gt;/g, '<span class="syn-bracket">&gt;</span>')
        .replace(/(<span class="syn-bracket">&lt;<\/span>)([a-zA-Z0-9!/-]+)/g, '$1<span class="syn-tag">$2</span>');
    };

    const formatTableTagName = (tagName) => {
      if (!tagName) return '';
      if (tagName.includes('type=')) {
        const match = tagName.match(/^<([a-zA-Z0-9]+)\s+type="(.*?)"\/?>$/);
        if (match) {
          const tag = match[1];
          const types = match[2];
          return `<span class="syn-bracket">&lt;</span><span class="syn-tag">${tag}</span><span class="syn-bracket">&gt;</span><div class="text-muted font-monospace fw-normal" style="font-size:0.7rem; line-height:1.25; margin-top:2px; word-break:break-word;"><span class="syn-attr">type</span>=<span class="syn-val">"${types}"</span></div>`;
        }
      }
      return syntaxHighlightTag(tagName);
    };

    const formatCodeSnippet = (code) => {
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
      activeAttr,
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
      selectAttribute,
      isAttrSelected,
      toggleTheme,
      copy,
      highlight,
      syntaxHighlightTag,
      formatTableTagName,
      formatCodeSnippet,
      getPedagoClass,
      getPedagoIcon,
      getPedagoTitle
    };
  }
}).mount('#app');
