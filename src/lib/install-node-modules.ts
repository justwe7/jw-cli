import * as spawn from 'cross-spawn'

interface installProps {
  cwd: string // 项目路径
  package: string // 包管理器 yarn 或者 npm
}

export default async (options: installProps) => {
  const cwd = options.cwd
  return new Promise<void>((resolve, reject) => {
    const command = options.package
    const args = ['install', '--save', '--save-exact', '--loglevel', 'error']
    const child = spawn(command, args, {
      cwd,
      stdio: ['pipe', process.stdout, process.stderr],
    })

    child.once('close', (code: number) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        })
        return
      }
      resolve()
    })
    child.once('error', reject)
  })
}
