/**
 * Утилиты для работы с графами.
 * Содержит функции для парсинга, алгоритмов и операций над графами.
 * 
 * Функции парсинга:
 * - parseAdjacencyMatrix: Парсит матрицу смежности
 * - parseAdjacencyList: Парсит список смежности
 * - parseIncidenceMatrix: Парсит матрицу инцидентности
 * 
 * Функции анализа:
 * - getDegrees: Возвращает степени вершин
 * - findConnectedComponents: Находит компоненты связности
 * - isEulerian: Проверяет эйлеровость графа
 * - isBipartite: Проверяет двудольность графа
 * - isCompleteBipartite: Проверяет полную двудольность
 * 
 * Алгоритмы обхода:
 * - dfs: Обход в глубину
 * - bfs: Обход в ширину
 * 
 * Алгоритмы на графах:
 * - primMST: Минимальное остовное дерево (Прима)
 * - dijkstra: Кратчайшие пути (Дейкстра)
 * - floydWarshall: Кратчайшие пути между всеми парами
 * - encodePrufer: Кодирование Прюфера
 * - decodePrufer: Декодирование Прюфера
 * - greedyColoring: Раскраска графа
 * 
 * Генерация:
 * - generateRandomGraph: Генерация случайного графа
 * - generateWeightedGraph: Генерация взвешенного графа
 */

/**
 * Парсит строку матрицы смежности в двумерный массив.
 * 
 * @param {string} input - Строка с матрицей смежности
 * @param {number} n - Размер матрицы (количество вершин)
 * @returns {number[][]} Матрица смежности
 */
export const parseAdjacencyMatrix = (input, n) => {
  if (!input || !input.trim()) return [];
  const lines = input.trim().split('\n');
  const matrix = [];
  for (let i = 0; i < Math.min(n, lines.length); i++) {
    const row = lines[i].trim().split(/[\s,]+/).map(Number);
    matrix.push(row.slice(0, n));
  }
  return matrix;
};


/**
 * Парсит строку списка смежности в матрицу смежности.
 * 
 * @param {string} input - Строка со списками смежности
 * @param {number} n - Количество вершин
 * @returns {number[][]} Матрица смежности
 */
export const parseAdjacencyList = (input, n) => {
  if (!input || !input.trim()) return Array.from({ length: n }, () => Array(n).fill(0));
  const lines = input.trim().split('\n');
  const list = Array.from({ length: n }, () => []);
  
  for (const line of lines) {
    const parts = line.trim().split(':');
    if (parts.length === 2) {
      const from = parseInt(parts[0]) - 1;
      const to = parts[1].trim().split(/[\s,]+/).map(Number).map(x => x - 1);
      if (from >= 0 && from < n) {
        list[from] = to.filter(x => x >= 0 && x < n);
      }
    }
  }
  
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (const j of list[i]) {
      matrix[i][j] = 1;
      matrix[j][i] = 1;
    }
  }
  return matrix;
};



/**
 * Парсит матрицу инцидентности в матрицу смежности.
 * 
 * @param {string} input - Строка с матрицей инцидентности
 * @param {number} n - Количество вершин
 * @returns {number[][]} Матрица смежности
 */
export const parseIncidenceMatrix = (input, n) => {
  if (!input || !input.trim()) return Array.from({ length: n }, () => Array(n).fill(0));
  const lines = input.trim().split('\n');
  const matrix = [];
  for (const line of lines) {
    const row = line.trim().split(/[\s,]+/).map(Number);
    matrix.push(row);
  }
  
  const adjMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  
  for (let col = 0; col < matrix[0]?.length || 0; col++) {
    const vertices = [];
    for (let row = 0; row < n; row++) {
      if (matrix[row] && matrix[row][col] === 1) {
        vertices.push(row);
      }
    }
    if (vertices.length === 2) {
      adjMatrix[vertices[0]][vertices[1]] = 1;
      adjMatrix[vertices[1]][vertices[0]] = 1;
    }
  }
  
  return adjMatrix;
};



/**
 * Вычисляет степени всех вершин графа.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {object[]} Массив объектов с номером вершины и степенью
 */
export const getDegrees = (matrix) => {
  if (!matrix || !matrix.length) return [];
  return matrix.map((row, i) => {
    let degree = row.reduce((sum, val) => sum + val, 0);
    return { vertex: i + 1, degree };
  });
};



/**
 * Находит все компоненты связности в графе.
 * Использует поиск в глубину для обхода компонент.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {number[][]} Массив компонент (каждая - массив вершин)
 */
export const findConnectedComponents = (matrix) => {
  if (!matrix || !matrix.length) return [];
  const n = matrix.length;
  const visited = Array(n).fill(false);
  const components = [];

  const dfs = (v, component) => {
    visited[v] = true;
    component.push(v);
    for (let i = 0; i < n; i++) {
      if (matrix[v][i] === 1 && !visited[i]) {
        dfs(i, component);
      }
    }
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const component = [];
      dfs(i, component);
      components.push(component.map(v => v + 1));
    }
  }

  return components;
};


/**
 * Проверяет, является ли граф эйлеровым или полуэйлеровым.
 * Граф эйлеров, если содержит цикл, проходящий через все ребра.
 * Полуэйлеров, если содержит путь, проходящий через все ребра.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {object} Объект с флагами isEulerian и isSemiEulerian
 */
export const isEulerian = (matrix) => {
  if (!matrix || !matrix.length) return { isEulerian: false, isSemiEulerian: false };
  const n = matrix.length;
  const components = findConnectedComponents(matrix);
  
  if (components.length !== 1) return { isEulerian: false, isSemiEulerian: false };
  
  for (let i = 0; i < n; i++) {
    const degree = matrix[i].reduce((sum, val) => sum + val, 0);
    if (degree % 2 !== 0) {
      for (let j = 0; j < n; j++) {
        const d = matrix[j].reduce((sum, val) => sum + val, 0);
        if (d % 2 !== 0) {
          return { isEulerian: false, isSemiEulerian: true };
        }
      }
      return { isEulerian: false, isSemiEulerian: false };
    }
  }
  
  return { isEulerian: true, isSemiEulerian: false };
};



/**
 * Проверяет, является ли граф двудольным.
 * Двудольный граф - вершины можно разделить на два множества без рёбер внутри множеств.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {object} Объект с флагом isBipartite и множествами sets
 */
export const isBipartite = (matrix) => {
  if (!matrix || !matrix.length) {
    return { isBipartite: false, sets: null };
  }
  const n = matrix.length;
  const color = Array(n).fill(-1);
  
  const bfs = (start) => {
    const queue = [start];
    color[start] = 0;
    
    while (queue.length > 0) {
      const v = queue.shift();
      for (let i = 0; i < n; i++) {
        if (matrix[v][i] === 1) {
          if (color[i] === -1) {
            color[i] = 1 - color[v];
            queue.push(i);
          } else if (color[i] === color[v]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && matrix[i].some(v => v === 1)) {
      if (!bfs(i)) return { isBipartite: false, sets: null };
    }
  }

  const set1 = [], set2 = [];
  color.forEach((c, i) => {
    if (c === 0) set1.push(i + 1);
    else if (c === 1) set2.push(i + 1);
  });
  
  return { isBipartite: true, sets: [set1, set2] };
};


/**
 * Проверяет, является ли граф полным двудольным.
 * Полный двудольный - каждая вершина из одного множества связана со всеми из другого.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {object} Объект с флагом isCompleteBipartite и множествами sets
 */
export const isCompleteBipartite = (matrix) => {
  if (!matrix || !matrix.length) {
    return { isCompleteBipartite: false, sets: null };
  }
  const n = matrix.length;
  const bipartiteResult = isBipartite(matrix);
  const { isBipartite: bip, sets } = bipartiteResult;
  
  if (!bip || !sets || sets[0].length === 0 || sets[1].length === 0) {
    return { isCompleteBipartite: false, sets: null };
  }

  const [set1, set2] = sets;
  
  for (const v1 of set1) {
    for (const v2 of set2) {
      if (matrix[v1 - 1][v2 - 1] !== 1) {
        return { isCompleteBipartite: false, sets };
      }
    }
  }
  
  for (const v1 of set1) {
    for (const v2 of set1) {
      if (v1 !== v2 && matrix[v1 - 1][v2 - 1] !== 0) {
        return { isCompleteBipartite: false, sets };
      }
    }
  }
  
  for (const v1 of set2) {
    for (const v2 of set2) {
      if (v1 !== v2 && matrix[v1 - 1][v2 - 1] !== 0) {
        return { isCompleteBipartite: false, sets };
      }
    }
  }
  
  return { isCompleteBipartite: true, sets };
};


/**
 * Выполняет обход графа в глубину (DFS).
 * Возвращает порядок обхода вершин.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @param {number} start - Начальная вершина (по умолчанию 0)
 * @returns {number[]} Порядок обхода вершин
 */
export const dfs = (matrix, start = 0) => {
  if (!matrix || !matrix.length) return [];
  const n = matrix.length;
  const visited = [];
  const order = [];
  
  const dfsRecursive = (v) => {
    visited[v] = true;
    order.push(v + 1);
    for (let i = 0; i < n; i++) {
      if (matrix[v][i] === 1 && !visited[i]) {
        dfsRecursive(i);
      }
    }
  };
  
  dfsRecursive(start);
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfsRecursive(i);
    }
  }
  
  return order;
};



/**
 * Выполняет обход графа в ширину (BFS).
 * Возвращает порядок обхода вершин по уровням.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @param {number} start - Начальная вершина (по умолчанию 0)
 * @returns {number[]} Порядок обхода вершин
 */
export const bfs = (matrix, start = 0) => {
  if (!matrix || !matrix.length) return [];
  const n = matrix.length;
  const visited = Array(n).fill(false);
  const queue = [start];
  const order = [];
  
  visited[start] = true;
  
  while (queue.length > 0) {
    const v = queue.shift();
    order.push(v + 1);
    
    for (let i = 0; i < n; i++) {
      if (matrix[v][i] === 1 && !visited[i]) {
        visited[i] = true;
        queue.push(i);
      }
    }
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      queue.push(i);
      visited[i] = true;
      while (queue.length > 0) {
        const v = queue.shift();
        order.push(v + 1);
        for (let j = 0; j < n; j++) {
          if (matrix[v][j] === 1 && !visited[j]) {
            visited[j] = true;
            queue.push(j);
          }
        }
      }
    }
  }
  
  return order;
};



/**
 * Находит минимальное остовное дерево (MST) алгоритмом Прима.
 * 
 * @param {number[][]} matrix - Матрица смежности с весами
 * @returns {object} Объект с рёбрами и общим весом
 */
export const primMST = (matrix) => {
  if (!matrix || !matrix.length) return { edges: [], totalWeight: 0 };
  const n = matrix.length;
  const inMST = Array(n).fill(false);
  const key = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);
  
  key[0] = 0;
  
  for (let count = 0; count < n - 1; count++) {
    let u = -1;
    let min = Infinity;
    
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && key[v] < min) {
        min = key[v];
        u = v;
      }
    }
    
    if (u === -1) break;
    
    inMST[u] = true;
    
    for (let v = 0; v < n; v++) {
      if (matrix[u][v] > 0 && !inMST[v] && matrix[u][v] < key[v]) {
        parent[v] = u;
        key[v] = matrix[u][v];
      }
    }
  }
  
  const edges = [];
  let totalWeight = 0;
  
  for (let i = 1; i < n; i++) {
    if (parent[i] !== -1) {
      edges.push({ from: parent[i] + 1, to: i + 1, weight: matrix[i][parent[i]] });
      totalWeight += matrix[i][parent[i]];
    }
  }
  
  return { edges, totalWeight };
};



/**
 * Находит кратчайшие пути от заданной вершины алгоритмом Дейкстры.
 * 
 * @param {number[][]} matrix - Матрица смежности с весами
 * @param {number} start - Начальная вершина (индексация с 0)
 * @param {boolean} isDirected - true для ориентированного графа, false для неориентированного
 * @returns {object[]} Массив объектов с вершиной и расстоянием
 */
export const dijkstra = (matrix, start, isDirected = false) => {
  if (!matrix || !matrix.length) return [];
  const n = matrix.length;
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  const processedEdges = new Set();
  
  dist[start] = 0;
  
  for (let count = 0; count < n; count++) {
    let u = -1;
    let min = Infinity;
    
    for (let v = 0; v < n; v++) {
      if (!visited[v] && dist[v] < min) {
        min = dist[v];
        u = v;
      }
    }
    
    if (u === -1) break;
    
    visited[u] = true;
    
    for (let v = 0; v < n; v++) {
      if (matrix[u][v] > 0 && !visited[v]) {
        const edgeKey = isDirected ? `${u}-${v}` : `${Math.min(u, v)}-${Math.max(u, v)}`;
        
        if (processedEdges.has(edgeKey)) continue;
        processedEdges.add(edgeKey);
        
        const newDist = dist[u] + matrix[u][v];
        if (newDist < dist[v]) {
          dist[v] = newDist;
        }
      }
    }
  }
  
  return dist.map((d, i) => ({ vertex: i + 1, distance: d === Infinity ? '∞' : d }));
};


/**
 * Находит кратчайшие пути между всеми парами вершин алгоритмом Флойда-Уоршелла.
 * Использует динамическое программирование.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {number[][]} Матрица кратчайших путей
 */
export const floydWarshall = (matrix) => {
  if (!matrix || !matrix.length) return [];
  const n = matrix.length;
  const dist = matrix.map(row => [...row]);
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] === 0) {
        dist[i][j] = Infinity;
      }
    }
  }
  
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  
  return dist.map((row, i) => 
    row.map((d, j) => d === Infinity ? '∞' : d)
  );
};



/**
 * Кодирует дерево в последовательность Прюфера.
 * Код Прюфера - последовательность длиной n-2.
 * 
 * @param {number[][]} edges - Массив рёбер дерева
 * @param {number} n - Количество вершин
 * @returns {number[]} Код Прюфера
 */
export const encodePrufer = (edges, n) => {
  if (!edges || !edges.length || !n) return [];
  const degree = Array(n + 1).fill(0);
  
  for (const [a, b] of edges) {
    degree[a]++;
    degree[b]++;
  }
  
  const code = [];
  const set = new Set();
  
  for (let i = 1; i <= n; i++) {
    if (degree[i] === 1) {
      set.add(i);
    }
  }
  
  for (let iteration = 0; iteration < n - 2; iteration++) {
    let smallest = n + 1;
    for (const leaf of set) {
      if (leaf < smallest) smallest = leaf;
    }
    
    set.delete(smallest);
    
    for (const [a, b] of edges) {
      if (a === smallest || b === smallest) {
        const neighbor = a === smallest ? b : a;
        code.push(neighbor);
        degree[neighbor]--;
        if (degree[neighbor] === 1) {
          set.add(neighbor);
        }
        break;
      }
    }
  }
  
  return code;
};



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



/**
 * Раскрашивает вершины графа жадным алгоритмом.
 * Каждой вершине назначается минимальный возможный цвет.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @returns {object} Объект с цветами вершин и минимальным числом цветов
 */
export const greedyColoring = (matrix) => {
  if (!matrix || !matrix.length) return { colors: [], minColors: 0 };
  const n = matrix.length;
  const colors = Array(n).fill(-1);
  const colorNames = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  
  colors[0] = 0;
  
  for (let i = 1; i < n; i++) {
    const used = Array(n).fill(false);
    
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1 && colors[j] !== -1) {
        used[colors[j]] = true;
      }
    }
    
    for (let c = 0; c < n; c++) {
      if (!used[c]) {
        colors[i] = c;
        break;
      }
    }
  }
  
  const maxColor = Math.max(...colors) + 1;
  const result = [];
  
  for (let i = 0; i < n; i++) {
    result.push({ 
      vertex: i + 1, 
      color: colors[i],
      colorName: colorNames[colors[i] % colorNames.length]
    });
  }
  
  return { colors: result, minColors: maxColor };
};

/**
 * Генерирует случайный связный граф.
 * При necessary делает граф связным, добавляя рёбра для связывания компонент.
 * 
 * @param {number} n - Количество вершин
 * @param {boolean} connected - Делать ли граф связным
 * @returns {number[][]} Матрица смежности
 */
export const generateRandomGraph = (n, connected = false) => {
  if (!n || n < 2) return [];
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  
  if (connected) {
    for (let i = 1; i < n; i++) {
      const j = Math.floor(Math.random() * i);
      matrix[i][j] = 1;
      matrix[j][i] = 1;
    }
  }
  
  const extraEdges = Math.floor(n * 0.5);
  for (let i = 0; i < extraEdges; i++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    if (a !== b) {
      matrix[a][b] = 1;
      matrix[b][a] = 1;
    }
  }
  
  return matrix;
};


/**
 * Генерирует случайный взвешенный граф.
 * Веса рёбер - случайные числа от 1 до 10.
 * 
 * @param {number} n - Количество вершин
 * @returns {number[][]} Матрица смежности с весами
 */
export const generateWeightedGraph = (n) => {
  if (!n || n < 2) return [];
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() > 0.5) {
        const weight = Math.floor(Math.random() * 10) + 1;
        matrix[i][j] = weight;
        matrix[j][i] = weight;
      }
    }
  }
  
  return matrix;
};
