import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeSwitcher from './ThemeSwitcher.vue'

describe('ThemeSwitcher', () => {
  it('renders a button', () => {
    const wrapper = mount(ThemeSwitcher)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
