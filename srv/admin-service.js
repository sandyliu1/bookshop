const cds = require('@sap/cds/lib')
const LOG = cds.log("admin-service")
module.exports = class AdminService extends cds.ApplicationService { init(){
  const { Books, Authors } = cds.entities
  this.before ('NEW','Books.drafts', genid)

  this.on('deepCreateBook', 'Books', async (req) => {
    let { book } = JSON.parse(req.data.data)
    LOG.info('Event deepCreateBook called with book', book.title)
    const { aID } = await cds.tx(req).run(SELECT.one.from(Authors).columns('max(ID) as aID'))
    let authorID = aID - aID % 100 + 100 + 1
    await cds.tx(req).run(INSERT.into(Authors).columns(
      'ID', 'name'
    ).values(
      authorID, book.author.name
    ))
    const { bID } = await cds.tx(req).run(SELECT.one.from(Books).columns('max(ID) as bID'))
    let bookID = bID - bID % 100 + 100 + 1
    await cds.tx(req).run(INSERT.into(Books).columns(
      'ID', 'title', 'author_id', 'stock', 'descr'
    ).values(
      bookID, book.title, authorID, 1, book.descr
    ))
    book.ID = bookID;
    book.author.ID = authorID;
    req.info(`Book ${book.title} (${book.ID}) created with author ${book.author.name}`)
    return book;
  })

  return super.init()
}}

/** Generate primary keys for target entity in request */
async function genid (req) {
  const {ID} = await cds.tx(req).run (SELECT.one.from(req.target.actives).columns('max(ID) as ID'))
  req.data.ID = ID - ID % 100 + 100 + 1
}
