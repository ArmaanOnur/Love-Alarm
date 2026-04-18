import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import type { DailyTask } from '../../types/alarm';

interface DailyTasksProps {
  tasks: DailyTask[];
  onComplete: (id: string) => void;
}

export function DailyTasks({ tasks, onComplete }: DailyTasksProps) {
  const completed = tasks.filter((t) => t.isCompleted).length;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Günlük Görevler</Text>
        <Text style={styles.progress}>{completed}/{tasks.length}</Text>
      </View>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[styles.task, task.isCompleted && styles.taskDone]}
          onPress={() => !task.isCompleted && onComplete(task.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.taskIcon}>{task.icon}</Text>
          <Text style={[styles.taskLabel, task.isCompleted && styles.taskLabelDone]}>
            {task.label}
          </Text>
          <View style={[styles.reward, task.isCompleted && styles.rewardDone]}>
            <Text style={styles.rewardText}>+{task.reward} ❤️</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  progress: { color: Colors.primary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
  task: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  taskDone: { opacity: 0.5 },
  taskIcon: { fontSize: 20 },
  taskLabel: { flex: 1, color: Colors.textPrimary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.sm },
  taskLabelDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  reward: { backgroundColor: `${Colors.primary}33`, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  rewardDone: { backgroundColor: Colors.surfaceBorder },
  rewardText: { color: Colors.primary, fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.semiBold },
});
