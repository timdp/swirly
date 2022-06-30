export class NotificationKind {
  static NEXT = new NotificationKind('N')
  static COMPLETE = new NotificationKind('C')
  static ERROR = new NotificationKind('E')

  #char: string

  private constructor (char: string) {
    this.#char = char
  }

  equals (x: any): boolean {
    return typeof x === 'string' && x.charAt(0).toUpperCase() === this.#char
  }
}
