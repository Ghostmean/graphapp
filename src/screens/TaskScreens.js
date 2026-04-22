import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassInput, GlassButton, GlassCard, InputSelector, NumberInput, ResultBox } from '../components/UIComponents';
import GraphVisualization from '../components/GraphVisualization';
import { libraryDefinitions, authors } from '../data/library';
import * as Utils from '../utils/graphUtils';
import { useTheme } from '../context/ThemeContext';

const taskTitles = [
  'Базовый анализ',
  'Обучение DFS',
  'Проверка DFS',
  'Обучение BFS',
  'Проверка BFS',
  'Подсчёт компонент',
  'Проверка компонент',
  'MST (Остовное дерево)',
  'Кратчайшие пути (Дейкстра)',
  'Флойд-Уоршелла',
  'Кодирование Прюфера',
  'Декодирование Прюфера',
  'Раскраска графа',
];

export const MainMenuScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e', '#0f3460'] : ['#c7d2fe', '#a5b4fc', '#818cf8']}
      style={styles.gradientBackground}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#312e81' }]}>Graph Explorer</Text>
          <Text style={[styles.subtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(49,46,129,0.7)' }]}>Изучение теории графов</Text>
          <Text style={[styles.description, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(49,46,129,0.6)' }]}>
            Интерактивное обучение алгоритмам на графах
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(79,70,229,0.15)', borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(79,70,229,0.3)' }]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Text style={[styles.themeToggleText, { color: isDark ? '#fff' : '#312e81' }]}>
            {isDark ? 'Светлая тема' : 'Тёмная тема'}
          </Text>
        </TouchableOpacity>

        <GlassButton
          title="Задачи"
          onPress={() => navigation.navigate('TasksList')}
          variant="accent"
          style={styles.mainMenuButton}
        />
        <GlassButton
          title="Библиотека"
          onPress={() => navigation.navigate('Library')}
          variant="primary"
          style={styles.mainMenuButton}
        />
        <GlassButton
          title="Об авторах"
          onPress={() => navigation.navigate('About')}
          variant="primary"
          style={styles.mainMenuButton}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export const TasksListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const handleTaskPress = (taskIndex) => {
    navigation.navigate('Task', { taskIndex });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerSmall}>
        <Text style={[styles.titleSmall, { color: theme.primary }]}>Выберите задачу</Text>
      </View>

      <View style={styles.taskGrid}>
        {taskTitles.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.taskButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => handleTaskPress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.taskIndex, { color: theme.primary }]}>{index}</Text>
            <Text style={[styles.taskTitle, { color: theme.text }]}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export const LibraryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  
  const definitions = Object.entries(libraryDefinitions);
  
  const filteredDefs = search 
    ? definitions.filter(([key]) => 
        key.toLowerCase().includes(search.toLowerCase())
      )
    : definitions;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <GlassInput
          label="Поиск"
          value={search}
          onChangeText={setSearch}
          placeholder="Введите термин..."
        />
        
        {filteredDefs.map(([term, definition], index) => (
          <GlassCard key={index} style={styles.definitionCard}>
            <Text style={[styles.termText, { color: theme.primary }]}>{term}</Text>
            <Text style={[styles.definitionText, { color: theme.text }]}>{definition}</Text>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
};

export const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <GlassCard style={styles.aboutCard}>
          <Text style={[styles.aboutTitle, { color: theme.primary }]}>Разработчики</Text>
          {authors.map((author, index) => (
            <View key={index} style={styles.authorItem}>
              <Text style={[styles.authorName, { color: theme.text }]}>{author.name}</Text>
              <Text style={[styles.authorRole, { color: theme.primary }]}>{author.role}</Text>
              <Text style={[styles.authorDesc, { color: theme.textSecondary }]}>{author.description}</Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </View>
  );
};

export const TaskScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { taskIndex } = route.params;
  
  const [numVertices, setNumVertices] = useState(5);
  const [inputFormat, setInputFormat] = useState('matrix');
  const [graphInput, setGraphInput] = useState('');
  const [result, setResult] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [generatedGraph, setGeneratedGraph] = useState(null);
  const [userSequence, setUserSequence] = useState('');
  const [startVertex, setStartVertex] = useState(1);
  const [pruferInput, setPruferInput] = useState('');
  const [error, setError] = useState('');

  const validateAndParseGraph = () => {
    setError('');
    
    if (!graphInput || graphInput.trim() === '') {
      setError('Введите данные графа');
      return null;
    }

    try {
      let parsed;
      
      if (inputFormat === 'matrix') {
        const lines = graphInput.trim().split('\n').filter(l => l.trim());
        if (lines.length < numVertices) {
          setError(`Матрица должна содержать ${numVertices} строк`);
          return null;
        }
        parsed = Utils.parseAdjacencyMatrix(graphInput, numVertices);
        
        let hasEdges = false;
        for (let i = 0; i < parsed.length; i++) {
          for (let j = i + 1; j < parsed.length; j++) {
            if (parsed[i][j] > 0) hasEdges = true;
          }
        }
        if (!hasEdges) {
          setError('Граф не содержит рёбер');
          return null;
        }
      } else if (inputFormat === 'list') {
        const lines = graphInput.trim().split('\n').filter(l => l.trim());
        if (lines.length === 0) {
          setError('Введите списки смежности');
          return null;
        }
        parsed = Utils.parseAdjacencyList(graphInput, numVertices);
      } else {
        const lines = graphInput.trim().split('\n').filter(l => l.trim());
        if (lines.length < numVertices) {
          setError(`Матрица инцидентности должна содержать ${numVertices} строк`);
          return null;
        }
        parsed = Utils.parseIncidenceMatrix(graphInput, numVertices);
      }
      
      if (!parsed || parsed.length < numVertices) {
        setError('Не удалось построить граф из введённых данных');
        return null;
      }
      
      return parsed;
    } catch (e) {
      setError('Ошибка при чтении данных: ' + e.message);
      return null;
    }
  };

  const showGraph = (m) => {
    setGeneratedGraph(m);
    setMatrix(m);
  };

  const executeTask = () => {
    const m = validateAndParseGraph();
    if (!m) return;
    
    showGraph(m);
    
    switch(taskIndex) {
      case 0: {
        const degrees = Utils.getDegrees(m);
        const components = Utils.findConnectedComponents(m);
        const eulerian = Utils.isEulerian(m);
        const bipartite = Utils.isBipartite(m);
        const completeBipartite = Utils.isCompleteBipartite(m);
        
        setResult({
          degrees: degrees.map(d => `Вершина ${d.vertex}: степень ${d.degree}`),
          components: components.length,
          isEulerian: eulerian.isEulerian ? 'Да' : 'Нет',
          isSemiEulerian: eulerian.isSemiEulerian ? 'Да' : 'Нет',
          isBipartite: bipartite.isBipartite ? 'Да' : 'Нет',
          isCompleteBipartite: completeBipartite.isCompleteBipartite ? 'Да' : 'Нет',
        });
        break;
      }
      case 1: {
        const order = Utils.dfs(m);
        setResult({ order: order.join(' → '), type: 'DFS' });
        break;
      }
      case 2: {
        const correctOrder = Utils.dfs(m);
        const userOrder = userSequence.split(/[\s,]+/).filter(x => x).map(Number);
        if (userOrder.some(isNaN) || userOrder.length !== numVertices) {
          setError(`Введите последовательность из ${numVertices} чисел`);
          return;
        }
        const correct = userOrder.length === correctOrder.length && 
          userOrder.every((v, i) => v === correctOrder[i]);
        setResult({ 
          correct: correct ? 'Правильно!' : 'Неправильно',
          correctAnswer: correctOrder.join(' → '),
        });
        break;
      }
      case 3: {
        const order = Utils.bfs(m);
        setResult({ order: order.join(' → '), type: 'BFS' });
        break;
      }
      case 4: {
        const correctOrder = Utils.bfs(m);
        const userOrder = userSequence.split(/[\s,]+/).filter(x => x).map(Number);
        if (userOrder.some(isNaN) || userOrder.length !== numVertices) {
          setError(`Введите последовательность из ${numVertices} чисел`);
          return;
        }
        const correct = userOrder.length === correctOrder.length && 
          userOrder.every((v, i) => v === correctOrder[i]);
        setResult({ 
          correct: correct ? 'Правильно!' : 'Неправильно',
          correctAnswer: correctOrder.join(' → '),
        });
        break;
      }
      case 5: {
        const components = Utils.findConnectedComponents(m);
        setResult({ count: components.length });
        break;
      }
      case 6: {
        const correctCount = Utils.findConnectedComponents(m).length;
        const userCount = parseInt(userSequence);
        if (isNaN(userCount)) {
          setError('Введите число');
          return;
        }
        setResult({ 
          correct: userCount === correctCount ? 'Правильно!' : 'Неправильно',
          correctAnswer: correctCount,
        });
        break;
      }
      case 7: {
        const weightedM = Utils.generateWeightedGraph(numVertices);
        const mst = Utils.primMST(weightedM);
        setResult({ 
          edges: mst.edges.map(e => `(${e.from} - ${e.to}) вес: ${e.weight}`),
          totalWeight: mst.totalWeight,
        });
        showGraph(weightedM);
        break;
      }
      case 8: {
        const weightedM = Utils.generateWeightedGraph(numVertices);
        const start = startVertex - 1;
        if (start < 0 || start >= numVertices) {
          setError('Неверный номер начальной вершины');
          return;
        }
        const distances = Utils.dijkstra(weightedM, start);
        setResult({ distances: distances.map(d => `До ${d.vertex}: ${d.distance}`) });
        showGraph(weightedM);
        break;
      }
      case 9: {
        const distMatrix = Utils.floydWarshall(m);
        setResult({ 
          matrix: distMatrix.map((row, i) => 
            `${i + 1}: ${row.join('  ')}`
          )
        });
        break;
      }
      case 10: {
        const edgesInput = pruferInput.trim().split('\n').map(line => {
          const [a, b] = line.split(/[\s,]+/);
          return [parseInt(a), parseInt(b)];
        }).filter(x => x[0] && x[1]);
        
        if (edgesInput.length !== numVertices - 1) {
          setError(`Введите ${numVertices - 1} рёбер (для дерева)`);
          return;
        }
        
        const code = Utils.encodePrufer(edgesInput, numVertices);
        setResult({ code: code.join(' ') });
        showGraph(m);
        break;
      }
      case 11: {
        const code = pruferInput.split(/[\s,]+/).filter(x => x).map(Number);
        
        if (code.length < 1 || code.length > 18) {
          setError('Введите корректный код Прюфера');
          return;
        }
        
        if (code.some(isNaN)) {
          setError('Код должен содержать только числа');
          return;
        }
        
        const edges = Utils.decodePrufer(code);
        setResult({ edges: edges.map(e => `${e[0]} - ${e[1]}`) });
        
        const treeMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));
        for (const [a, b] of edges) {
          treeMatrix[a-1][b-1] = 1;
          treeMatrix[b-1][a-1] = 1;
        }
        showGraph(treeMatrix);
        break;
      }
      case 12: {
        const coloring = Utils.greedyColoring(m);
        setResult({ 
          minColors: coloring.minColors,
          colors: coloring.colors.map(c => `Вершина ${c.vertex}: цвет ${c.color + 1}`),
        });
        break;
      }
    }
  };

  const renderInput = () => {
    if (taskIndex === 10 || taskIndex === 11) {
      return (
        <GlassInput
          label={taskIndex === 10 ? "Список рёбер (одно ребро на строке: a b)" : "Код Прюфера (через пробел)"}
          value={pruferInput}
          onChangeText={setPruferInput}
          placeholder={taskIndex === 10 ? "1 2\n2 3\n3 4" : "2 3 3"}
          multiline
        />
      );
    }

    return (
      <>
        <NumberInput
          label="Число вершин"
          value={numVertices}
          onChangeText={(val) => {
            setNumVertices(val);
            setMatrix(null);
            setGeneratedGraph(null);
            setResult(null);
            setError('');
          }}
          min={2}
          max={20}
        />
        
        <InputSelector
          options={['matrix', 'list', 'incidence']}
          selected={inputFormat}
          onSelect={(val) => {
            setInputFormat(val);
            setError('');
          }}
          labels={['Матрица смежности', 'Список смежности', 'Матрица инцидентности']}
        />
        
        <GlassInput
          label={inputFormat === 'matrix' ? `Матрица ${numVertices}x${numVertices} (строки через Enter)` : 
                inputFormat === 'list' ? 'Списки (вершина: соседи)' : 
                `Матрица инцидентности (${numVertices} строк)`}
          value={graphInput}
          onChangeText={(text) => {
            setGraphInput(text);
            setError('');
          }}
          placeholder={
            inputFormat === 'matrix' 
              ? '0 1 1 0\n1 0 1 1\n1 1 0 1\n0 1 1 0' 
              : inputFormat === 'list' 
                ? '1: 2 3\n2: 1 3 4\n3: 1 2 4\n4: 2 3' 
                : '1 1 0\n1 1 1\n0 1 1\n0 1 1'
          }
          multiline
        />
      </>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    if (taskIndex === 0) {
      return (
        <View>
          {result.degrees.map((d, i) => (
            <ResultBox key={i} title={`Степень вершины ${i + 1}`} content={d.split(': ')[1]} />
          ))}
          <ResultBox title="Компонент связности" content={result.components} />
          <ResultBox title="Эйлеров граф" content={result.isEulerian} />
          <ResultBox title="Полуэйлеров граф" content={result.isSemiEulerian} />
          <ResultBox title="Двудольный граф" content={result.isBipartite} />
          <ResultBox title="Полный двудольный" content={result.isCompleteBipartite} />
        </View>
      );
    }
    
    if (taskIndex === 1 || taskIndex === 3) {
      return <ResultBox title={result.type} content={result.order} />;
    }
    
    if (taskIndex === 2 || taskIndex === 4 || taskIndex === 6) {
      return (
        <View>
          <ResultBox title="Результат" content={result.correct} />
          {!result.correct.includes('Правильно') && <ResultBox title="Правильный ответ" content={result.correctAnswer} />}
        </View>
      );
    }
    
    if (taskIndex === 5) {
      return <ResultBox title="Число компонент" content={result.count} />;
    }
    
    if (taskIndex === 7) {
      return (
        <View>
          {result.edges.map((e, i) => <ResultBox key={i} content={e} />)}
          <ResultBox title="Общий вес" content={result.totalWeight} />
        </View>
      );
    }
    
    if (taskIndex === 8) {
      return (
        <View>
          {result.distances.map((d, i) => <ResultBox key={i} content={d} />)}
        </View>
      );
    }
    
    if (taskIndex === 9) {
      return (
        <View>
          {result.matrix.map((row, i) => <ResultBox key={i} content={row} />)}
        </View>
      );
    }
    
    if (taskIndex === 10) {
      return <ResultBox title="Код Прюфера" content={result.code} />;
    }
    
    if (taskIndex === 11) {
      return (
        <View>
          {result.edges.map((e, i) => <ResultBox key={i} content={e} />)}
        </View>
      );
    }
    
    if (taskIndex === 12) {
      return (
        <View>
          <ResultBox title="Минимальное число цветов" content={result.minColors} />
          {result.colors.map((c, i) => <ResultBox key={i} content={c} />)}
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <GlassCard style={styles.taskHeader}>
          <Text style={[styles.taskIndexTitle, { color: theme.primary }]}>Задача {taskIndex}</Text>
          <Text style={[styles.taskName, { color: theme.text }]}>{taskTitles[taskIndex]}</Text>
        </GlassCard>
        
        {renderInput()}
        
        {taskIndex === 2 || taskIndex === 4 ? (
          <GlassInput
            label={`Введите последовательность (${numVertices} чисел)`}
            value={userSequence}
            onChangeText={setUserSequence}
            placeholder="1 2 3 4 5"
          />
        ) : null}
        
        {taskIndex === 6 ? (
          <GlassInput
            label="Введите число компонент"
            value={userSequence}
            onChangeText={setUserSequence}
            placeholder="1"
            keyboardType="numeric"
          />
        ) : null}
        
        {taskIndex === 8 ? (
          <NumberInput
            label="Начальная вершина"
            value={startVertex}
            onChangeText={setStartVertex}
            min={1}
            max={numVertices}
          />
        ) : null}
        
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.error, borderColor: theme.errorBorder }]}>
            <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
          </View>
        ) : null}
        
        <GlassButton title="Выполнить" onPress={executeTask} />
        
        {generatedGraph && (
          <GraphVisualization 
            matrix={generatedGraph} 
            weighted={taskIndex === 7 || taskIndex === 8}
            vertexColors={taskIndex === 12 ? result?.colors?.map((c, i) => ({ color: parseInt(c.split(' ')[2]), colorName: ['#9B59B6', '#8E44AD', '#E8DAEF', '#D7BDE2', '#AF7AC5', '#BB8FCE'][parseInt(c.split(' ')[2]) % 6] })) : []}
          />
        )}
        
        {renderResult()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 60,
  },
  headerSmall: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1,
  },
  titleSmall: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 32,
  },
  themeToggle: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainMenuButton: {
    marginVertical: 12,
    paddingVertical: 20,
  },
  taskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  taskButton: {
    borderRadius: 20,
    padding: 20,
    margin: 8,
    width: '45%',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  taskIndex: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  taskHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  taskIndexTitle: {
    fontSize: 14,
  },
  taskName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  errorBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  definitionCard: {
    marginBottom: 12,
  },
  termText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  aboutCard: {
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  authorItem: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    width: '100%',
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  authorRole: {
    fontSize: 14,
    marginTop: 4,
  },
  authorDesc: {
    fontSize: 14,
    marginTop: 8,
  },
});
