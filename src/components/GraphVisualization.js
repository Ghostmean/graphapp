/**
 * Компонент визуализации графа.
 * Отображает граф в виде круга с вершинами и рёбрами.
 * Поддерживает взвешенные графы и раскраску вершин.
 * 
 * @param {number[][]} matrix - Матрица смежности
 * @param {boolean} weighted - Отображать ли веса рёбер
 * @param {object[]} highlightedEdges - Выделенные рёбра
 * @param {object[]} vertexColors - Цвета вершин
 * @param {function} onVertexPress - Обработчик нажатия на вершину
 */
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Animated } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_SIZE = Math.min(screenWidth - 40, 280);

const TRAVERSAL_COLORS = {
  unvisited: null,
  current: '#FFD700',
  visited: '#4CAF50',
  visitedSecondary: '#81C784',
};

/**
 * Визуализация графа.
 * 
 * @param {object} props - Свойства компонента
 * @returns {View} Компонент визуализации
 */
const GraphVisualization = ({ 
  matrix, 
  weighted = false,
  highlightedEdges = [],
  vertexColors = [],
  onVertexPress,
  traversalAnimation = null,
}) => {
  const { theme, isDark } = useTheme();
  const n = matrix ? matrix.length : 0;
  
  const [currentVertex, setCurrentVertex] = useState(-1);
  const [visitedVertices, setVisitedVertices] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (traversalAnimation && traversalAnimation.order && traversalAnimation.order.length > 0) {
      setVisitedVertices([]);
      setCurrentVertex(-1);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < traversalAnimation.order.length) {
          const vertex = traversalAnimation.order[index];
          setCurrentVertex(vertex - 1);
          setVisitedVertices(prev => [...prev, vertex - 1]);
          index++;
        } else {
          setCurrentVertex(-1);
          clearInterval(interval);
        }
      }, 600);
      
      return () => clearInterval(interval);
    } else {
      setVisitedVertices([]);
      setCurrentVertex(-1);
    }
  }, [traversalAnimation]);
  
  const positions = useMemo(() => {
    if (!matrix || n === 0) return [];
    const positions = [];
    const centerX = GRAPH_SIZE / 2;
    const centerY = GRAPH_SIZE / 2;
    const radius = Math.min(GRAPH_SIZE / 2 - 25, 80);
    
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  }, [n]);

  const [draggedPos, setDraggedPos] = useState(null);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, state) => {
        const { locationX, locationY } = evt.nativeEvent;
        for (let i = 0; i < positions.length; i++) {
          const dx = locationX - positions[i].x;
          const dy = locationY - positions[i].y;
          if (Math.sqrt(dx*dx + dy*dy) < 20) {
            setDraggedPos(i);
            break;
          }
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (draggedPos === null) return;
        const { locationX, locationY } = evt.nativeEvent;
        setDraggedPos((prev) => {
          if (prev === null) return null;
          return prev;
        });
      },
      onPanResponderRelease: () => {
        setDraggedPos(null);
      },
    });
  }, [positions, draggedPos]);

  if (!matrix || n === 0) {
    return (
      <View style={styles.container}>
        <Svg width={GRAPH_SIZE} height={GRAPH_SIZE} />
      </View>
    );
  }

  const renderEdges = () => {
    const edges = [];
    
    for (let i = 0; i < n; i++) {
      if (!matrix[i]) continue;
      for (let j = i + 1; j < n; j++) {
        if (matrix[i][j] > 0 && positions[i] && positions[j]) {
          const isHighlighted = highlightedEdges.some(
            e => (e.from === i + 1 && e.to === j + 1) || (e.from === j + 1 && e.to === i + 1)
          );
          
          const isColored = vertexColors.length > 0 && 
            vertexColors[i] && vertexColors[j] && 
            vertexColors[i].color === vertexColors[j].color;
          
          edges.push(
            <G key={`edge-${i}-${j}`}>
              <Line
                x1={positions[i].x}
                y1={positions[i].y}
                x2={positions[j].x}
                y2={positions[j].y}
                stroke={isHighlighted ? '#FFD700' : isColored ? '#FF6B6B' : '#888'}
                strokeWidth={isHighlighted ? 3 : 1.5}
              />
              {weighted && matrix[i][j] > 0 && (
                <SvgText
                  x={(positions[i].x + positions[j].x) / 2}
                  y={(positions[i].y + positions[j].y) / 2 - 8}
                  fontSize={10}
                  fill="#333"
                  textAnchor="middle"
                >
                  {matrix[i][j]}
                </SvgText>
              )}
            </G>
          );
        }
      }
    }
    
    return edges;
  };

  const renderVertices = (vertexColors, visitedVertices, currentVertex) => {
    const vertexRadius = Math.max(10, 22 - n);
    const fontSize = Math.max(8, 12 - n * 0.3);
    
    return positions.map((pos, index) => {
      if (!pos) return null;
      
      let fillColor = theme.primary;
      let strokeColor = isDark ? '#fff' : '#333';
      let strokeWidth = 2;
      
      if (vertexColors.length > 0 && vertexColors[index]) {
        fillColor = vertexColors[index].colorName || theme.primary;
      }
      
      if (currentVertex === index) {
        fillColor = TRAVERSAL_COLORS.current;
        strokeWidth = 3;
      } else if (visitedVertices.includes(index)) {
        fillColor = visitedVertices.length === traversalAnimation?.order?.length 
          ? TRAVERSAL_COLORS.visited 
          : TRAVERSAL_COLORS.visitedSecondary;
      }
      
      return (
        <G key={`vertex-${index}`}>
          <Circle
            cx={pos.x}
            cy={pos.y}
            r={vertexRadius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <SvgText
            x={pos.x}
            y={pos.y + 3}
            fontSize={fontSize}
            fill={strokeColor}
            textAnchor="middle"
            fontWeight="bold"
          >
            {index + 1}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={GRAPH_SIZE} height={GRAPH_SIZE}>
        {renderEdges()}
        {renderVertices(vertexColors, visitedVertices, currentVertex)}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 10,
    marginVertical: 10,
  },
});

export default GraphVisualization;
