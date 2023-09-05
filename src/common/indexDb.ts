import Dexie from 'dexie'
interface Iparams {
  databaseName: string
  version?: string | number
  objectStores?: Record<string, any>
  objectStoreName?: string
  objectStoreOptions?: Record<string, any>
  objectStoreIndex?: Record<string, any>
  [index: string]: any
}
class IndexDb extends Dexie {
  request: any
  db: any
  public constructor({ databaseName = location.origin, ...rest }: Iparams) {
    super()
    // Check for support.
    if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB.")
      return this
    }

    this.db = new Dexie(databaseName, ...rest)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.db
    //   this.request = window.indexedDB.open(databaseName, version)
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   this.request.onsuccess = (event) => {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    //     this.db = this?.request?.result;
    //     console.log('数据库打开成功');
    //   };

    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   this.request.onerror = (event) => {
    //     console.log('数据库打开报错');
    //   };

    //   // 数据仓库升级事件(第一次新建库是也会触发，因为数据仓库从无到有算是升级了一次)
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   this.request.onupgradeneeded = (res) => {
    //     console.info('IndexDB升级成功', res);
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    //     this.db = res?.target?.result;
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    //     if (!this.db.objectStoreName.contains(location.hostname)) {
    //       db_table = db.createObjectStore(location.hostname, { keyPath: 'id', auto });
    //     }
    //   }
  }
}

export default IndexDb
