import * as spawn from 'cross-spawn'

interface installProps {
  cwd: string // 项目路径
}

export default async (options: installProps) => {
  const cwd = options.cwd
  spawn.sync('git', ['init'], { cwd, stdio: 'inherit' })
  spawn.sync('git', ['add', '.'], { cwd, stdio: 'ignore' })
  spawn.sync('git', ['commit', '-m', 'Initial project'], {
    cwd,
    stdio: 'ignore',
  })
}
