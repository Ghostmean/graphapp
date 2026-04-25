/**
 * Декодирует последовательность Прюфера в дерево.
 * Восстанавливает дерево из кода Прюфера.
 *
 * @param {number[]} code - Код Прюфера
 * @returns {number[][]} Массив рёбер дерева
 */
export const decodePrufer = (code) => {
  if (!code || !code.length) return [];
  const n = code.length + 2;
  const degree = Array(n + 1).fill(1);
  
  for (const num of code) {
    degree[num]++;
  }
  
  const edges = [];
  const set = new Set();
  
  for (let i = 1; i <= n; i++) {
    if (degree[i] === 1) {
      set.add(i);
    }
  }
  
  for (const num of code) {
    let smallest = n + 1;
    for (const leaf of set) {
      if (leaf < smallest) smallest = leaf;
    }
    
    edges.push([smallest, num]);
    set.delete(smallest);
    degree[smallest]--;
    degree[num]--;
    
    if (degree[num] === 1) {
      set.add(num);
    }
  }
  
  const remaining = Array.from(set).sort((a, b) => a - b);
  edges.push([remaining[0], remaining[1]]);
  
  return edges;
};