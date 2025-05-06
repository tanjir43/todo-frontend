import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TaskList from '../tasks/TaskList.vue'
import TaskItem from '../tasks/TaskItem.vue'
import TaskFilter from '../tasks/TaskFilter.vue'

vi.mock('@/stores/task', () => ({
  useTaskStore: () => ({
    tasks: [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Description 1',
        completed: false,
        created_at: '2023-01-01T12:00:00Z',
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Description 2',
        completed: true,
        created_at: '2023-01-02T12:00:00Z',
      },
    ],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    },
    filters: {
      search: '',
      completed: null,
      sort_by: 'created_at',
      sort_direction: 'desc',
    },
    fetchTasks: vi.fn(),
    toggleTaskCompletion: vi.fn(),
    deleteTask: vi.fn(),
    setFilter: vi.fn(),
    setPage: vi.fn(),
  }),
}))

describe('TaskList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly with tasks', () => {
    const wrapper = mount(TaskList)

    expect(wrapper.findComponent(TaskFilter).exists()).toBe(true)

    const taskItems = wrapper.findAllComponents(TaskItem)
    expect(taskItems.length).toBe(2)
    expect(taskItems[0].props('task').title).toBe('Test Task 1')
  })

  it('calls toggleComplete when task completion is toggled', async () => {
    const wrapper = mount(TaskList)

    await wrapper.findComponent(TaskItem).vm.$emit('toggle-complete', 1)

    const taskStore = wrapper.vm.taskStore
    expect(taskStore.toggleTaskCompletion).toHaveBeenCalledWith(1)
  })

  it('shows delete confirmation dialog when delete is clicked', async () => {
    const wrapper = mount(TaskList)

    await wrapper.findComponent(TaskItem).vm.$emit('delete', 1)

    expect(wrapper.vm.showDeleteModal).toBe(true)
    expect(wrapper.vm.taskToDelete).toBe(1)

    const deleteButton = wrapper.findAll('button').find((btn) => btn.text() === 'Delete')

    expect(deleteButton.exists()).toBe(true)

    await deleteButton.trigger('click')

    const taskStore = wrapper.vm.taskStore
    expect(taskStore.deleteTask).toHaveBeenCalledWith(1)
  })
})
