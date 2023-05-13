import {
    ABISerializableObject,
    Action,
    Name,
    NameType,
    Session,
    TransactResult,
} from '@wharfkit/session'

interface GetTableRowsOptions {
    // Query
    scope?: string; // default: matches contract account name
    // Response
    json?: boolean; // default: true
    // Pagination
    start?: string; // default: null, used for lower_bound
    end?: string; // default: null, used for upper_bound
    limit?: number; // default: 100, used for limit
    // Indices
    index?: number; // default: 1, used for index_position
    indexType? : string; // default: "", used for key_type
}

export class Contract {
    /** Account where contract is deployed. */
    static account?: NameType

    private static _shared: Contract | null = null

    /** Account where contract is deployed. */
    readonly account: Name

    constructor(account?: NameType) {
        if ((this.constructor as typeof Contract).account) {
            if (account) {
                throw new Error('Cannot specify account when using subclassed Contract')
            }
            this.account = Name.from((this.constructor as typeof Contract).account!)
        } else {
            if (!account) {
                throw new Error('Must specify account when using Contract directly')
            }
            this.account = Name.from(account)
        }
    }

    /** Shared instance of the contract. */
    static shared<T extends {new ()}>(this: T): InstanceType<T> {
        const self = this as unknown as typeof Contract
        if (!self._shared) {
            self._shared = new self()
        }
        return self._shared as InstanceType<T>
    }

    /** Call a contract action. */
    async call(
        name: NameType,
        data: ABISerializableObject | {[key: string]: any},
        session: Session
    ): Promise<TransactResult> {
        const action: Action = Action.from({
            account: this.account,
            name,
            authorization: [],
            data,
        })

        // Trigger the transaction using the session kit
        return session.transact({action})
    }

    static async function getTableRows(table: string, options: GetTableRowsOptions = {}): Promise<TableCursor> {
        const scope = options.scope || contract.account;
        const json = options.json ?? true;
        const start = options.start || null;
        const end = options.end || null;
        const limit = options.limit || 100;
        const index = options.index || 1;
        const indexType = options.indexType || "";
    
        const response = await contract.client.v1.chain.get_table_rows({
            json,
            code: contract.account,
            scope,
            table,
            table_key: "",
            lower_bound: start,
            upper_bound: end,
            limit,
            key_type: indexType,
            index_position: index,
        });
        
        return new TableCursor(response.rows, response.more);
    }
}

class TableCursor {
  constructor(rows, more) {
    this.rows = rows;
    this.more = more;
    this.currentIndex = 0;
  }

  // Allows for iteration through rows
  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.currentIndex < this.rows.length) {
          return { value: this.rows[this.currentIndex++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }

  // Fetches more rows
  async more() {
    if (this.more) {
      // Here you should implement code to fetch next batch of rows from the server
      // This is just a simplified example without actual server call
      const response = await fetchNextBatch(); // fetchNextBatch is a hypothetical function
      this.rows = response.rows;
      this.more = response.more;
      this.currentIndex = 0;
    }
    return this;
  }
}

