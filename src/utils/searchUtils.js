// Fuzzy search implementation for typo tolerance
export const fuzzySearch = (query, items, searchField = 'name') => {
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '');
  const queryNorm = normalize(query);

  const score = (str) => {
    const strNorm = normalize(str);
    let score = 0;
    let queryIdx = 0;
    let strIdx = 0;

    while (queryIdx < queryNorm.length && strIdx < strNorm.length) {
      if (queryNorm[queryIdx] === strNorm[strIdx]) {
        score += 10;
        queryIdx++;
        strIdx++;
      } else {
        score -= 1;
        strIdx++;
      }
    }

    // Perfect match bonus
    if (strNorm === queryNorm) score += 100;
    // Starts with bonus
    if (strNorm.startsWith(queryNorm)) score += 50;
    // Contains bonus
    if (strNorm.includes(queryNorm)) score += 25;

    return queryIdx === queryNorm.length ? score : -Infinity;
  };

  return items
    .map(item => ({
      item,
      score: score(item[searchField] || ''),
    }))
    .filter(({ score }) => score > -Infinity)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};

// Trie implementation for prefix search optimization
export class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.contacts = [];
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, contact) {
    let node = this.root;
    word = word.toLowerCase();

    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.contacts.push(contact);
    }
    node.isEnd = true;
  }

  search(prefix) {
    let node = this.root;
    prefix = prefix.toLowerCase();

    for (let char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }

    return [...new Set(node.contacts)]; // Remove duplicates
  }

  buildFromContacts(contacts) {
    contacts.forEach(contact => {
      // Index by name
      this.insert(contact.name, contact);
      // Index by email
      if (contact.email) this.insert(contact.email, contact);
      // Index by phone
      if (contact.phone) this.insert(contact.phone, contact);
      // Index by company
      if (contact.company) this.insert(contact.company, contact);
    });
  }
}

// Advanced search function combining multiple strategies
export const advancedSearch = (contacts, query) => {
  if (!query.trim()) return contacts;

  const queryLower = query.toLowerCase();
  const trie = new Trie();
  trie.buildFromContacts(contacts);

  // First try Trie prefix search
  const trieResults = trie.search(query);
  if (trieResults.length > 0) {
    return trieResults;
  }

  // Fall back to fuzzy search
  const results = [];
  const addedIds = new Set();

  // Search in different fields with priority
  const fieldScores = {
    name: 10,
    email: 8,
    phone: 8,
    company: 6,
    address: 4,
  };

  contacts.forEach(contact => {
    let bestScore = 0;

    Object.entries(fieldScores).forEach(([field, weight]) => {
      const fieldValue = contact[field];
      if (!fieldValue) return;

      const fieldLower = fieldValue.toLowerCase();

      // Exact match
      if (fieldLower === queryLower) {
        bestScore = Math.max(bestScore, weight * 100);
      }
      // Starts with
      else if (fieldLower.startsWith(queryLower)) {
        bestScore = Math.max(bestScore, weight * 50);
      }
      // Contains
      else if (fieldLower.includes(queryLower)) {
        bestScore = Math.max(bestScore, weight * 25);
      }
      // Fuzzy match
      else {
        const chars = queryLower.split('');
        let charIdx = 0;
        for (let i = 0; i < fieldLower.length && charIdx < chars.length; i++) {
          if (fieldLower[i] === chars[charIdx]) charIdx++;
        }
        if (charIdx === chars.length) {
          bestScore = Math.max(bestScore, weight * 10);
        }
      }
    });

    if (bestScore > 0 && !addedIds.has(contact.id)) {
      results.push({ contact, score: bestScore });
      addedIds.add(contact.id);
    }
  });

  return results.sort((a, b) => b.score - a.score).map(r => r.contact);
};

// Highlight matching text
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const highlightText = (text, query) => {
  if (!query) return text;
  if (!text) return '';

  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 font-semibold">$1</mark>');
};
