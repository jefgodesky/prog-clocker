const ready = {
  name: 'ready',
  once: true,
  execute (client) {
    console.log('Prog Clocker is ready to clock')
  }
}

export default ready
