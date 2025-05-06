import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TaskForm from '../tasks/TaskForm.vue'

vi.mock('@/stores/task', () => ({
  useTaskStore: () => ({
    taskById: (id) =>
      id === 1
        ? {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            completed: false,
          }
        : null,
    currentTask: null,
    fetchTask: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
  }),
}))

describe('TaskForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders create form correctly', () => {
    const wrapper = mount(TaskForm)

    expect(wrapper.find('h2').text()).toBe('Create New Task')
    expect(wrapper.find('#title').exists()).toBe(true)
    expect(wrapper.find('#description').exists()).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create Task')
  })

  it('renders edit form correctly', async () => {
    const wrapper = mount(TaskForm, {
      props: {
        taskId: 1,
      },
    })

    await vi.runAllTimers()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('h2').text()).toBe('Edit Task')
    expect(wrapper.find('#title').element.value).toBe('Test Task')
    expect(wrapper.find('#description').element.value).toBe('Test Description')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(false)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Update Task')
  })

  it('validates title is required', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('#title').setValue('')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.text-red-500').exists()).toBe(true)
    expect(wrapper.find('.text-red-500').text()).toBe('Title is required')

    const taskStore = wrapper.vm.taskStore
    expect(taskStore.createTask).not.toHaveBeenCalled()
  })

  it('calls createTask with form data when creating', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('#title').setValue('New Task')
    await wrapper.find('#description').setValue('New Description')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    await wrapper.find('form').trigger('submit.prevent')

    const taskStore = wrapper.vm.taskStore
    expect(taskStore.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      completed: true,
    })

    expect(wrapper.emitted().submit).toBeTruthy()
  })

  it('calls updateTask with form data when editing', async () => {
    const wrapper = mount(TaskForm, {
      props: {
        taskId: 1,
      },
    })

    await vi.runAllTimers()
    await wrapper.vm.$nextTick()

    await wrapper.find('#title').setValue('Updated Task')
    await wrapper.find('#description').setValue('Updated Description')

    await wrapper.find('form').trigger('submit.prevent')

    const taskStore = wrapper.vm.taskStore
    expect(taskStore.updateTask).toHaveBeenCalledWith(1, {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: false,
    })

    expect(wrapper.emitted().submit).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('button[type="button"]').trigger('click')

    expect(wrapper.emitted().cancel).toBeTruthy()
  })
})
