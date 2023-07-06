import {Contract, Table, TableCursor} from '@wharfkit/contract'
import {
    Struct,
    Name,
    NameType,
    Asset,
    AssetType,
    UInt16,
    UInt16Type,
    UInt32,
    UInt32Type,
    UInt64,
    UInt64Type,
    UInt8,
    UInt8Type,
    TransactResult,
    APIClient,
    Checksum256,
    TimePointSec,
} from '@wharfkit/session'
export class _Decentiumorg extends Contract {
    addcategory(category: NameType): Promise<TransactResult> {
        return this.call(
            'addcategory',
            _Decentiumorg.types.Action_addcategory.from({category: category})
        )
    }
    addmoderator(account: NameType): Promise<TransactResult> {
        return this.call(
            'addmoderator',
            _Decentiumorg.types.Action_addmoderator.from({account: account})
        )
    }
    createblog(author: NameType): Promise<TransactResult> {
        return this.call('createblog', _Decentiumorg.types.Action_createblog.from({author: author}))
    }
    delcategory(category: NameType): Promise<TransactResult> {
        return this.call(
            'delcategory',
            _Decentiumorg.types.Action_delcategory.from({category: category})
        )
    }
    deleteblog(author: NameType, max_itr: UInt32Type): Promise<TransactResult> {
        return this.call(
            'deleteblog',
            _Decentiumorg.types.Action_deleteblog.from({author: author, max_itr: max_itr})
        )
    }
    delmoderator(account: NameType): Promise<TransactResult> {
        return this.call(
            'delmoderator',
            _Decentiumorg.types.Action_delmoderator.from({account: account})
        )
    }
    freezeblog(author: NameType, reason: string): Promise<TransactResult> {
        return this.call(
            'freezeblog',
            _Decentiumorg.types.Action_freezeblog.from({author: author, reason: reason})
        )
    }
    housekeeping(max_itr: UInt32Type): Promise<TransactResult> {
        return this.call(
            'housekeeping',
            _Decentiumorg.types.Action_housekeeping.from({max_itr: max_itr})
        )
    }
    pinpost(author: NameType, slug: NameType): Promise<TransactResult> {
        return this.call(
            'pinpost',
            _Decentiumorg.types.Action_pinpost.from({author: author, slug: slug})
        )
    }
    post(author: NameType, slug: NameType): Promise<TransactResult> {
        return this.call(
            'post',
            _Decentiumorg.types.Action_pinpost.from({author: author, slug: slug})
        )
    }
    postedit(
        author: NameType,
        new_title: string,
        patch: string,
        new_metadata: _Decentiumorg.types.Metadata
    ): Promise<TransactResult> {
        return this.call(
            'postedit',
            _Decentiumorg.types.Action_postedit.from({
                author: author,
                new_title: new_title,
                patch: patch,
                new_metadata: new_metadata,
            })
        )
    }
    profile(author: NameType, name: string, bio: string, image: string): Promise<TransactResult> {
        return this.call(
            'profile',
            _Decentiumorg.types.Action_profile.from({
                author: author,
                name: name,
                bio: bio,
                image: image,
            })
        )
    }
    publish(
        permlink: _Decentiumorg.types.Permlink,
        tx: _Decentiumorg.types.Tx_ref,
        category: NameType,
        options: post_options,
        links: _Decentiumorg.types.Permlink
    ): Promise<TransactResult> {
        return this.call(
            'publish',
            _Decentiumorg.types.Action_publish.from({
                permlink: permlink,
                tx: tx,
                category: category,
                options: options,
                links: links,
            })
        )
    }
    publishedit(
        permlink: _Decentiumorg.types.Permlink,
        edit_tx: _Decentiumorg.types.Tx_ref
    ): Promise<TransactResult> {
        return this.call(
            'publishedit',
            _Decentiumorg.types.Action_publishedit.from({permlink: permlink, edit_tx: edit_tx})
        )
    }
    setlinkflags(link_id: UInt64Type, new_flags: link_flags): Promise<TransactResult> {
        return this.call(
            'setlinkflags',
            _Decentiumorg.types.Action_setlinkflags.from({link_id: link_id, new_flags: new_flags})
        )
    }
    setprofile(author: NameType, profile: _Decentiumorg.types.Tx_ref): Promise<TransactResult> {
        return this.call(
            'setprofile',
            _Decentiumorg.types.Action_setprofile.from({author: author, profile: profile})
        )
    }
    unfreezeblog(author: NameType): Promise<TransactResult> {
        return this.call(
            'unfreezeblog',
            _Decentiumorg.types.Action_unfreezeblog.from({author: author})
        )
    }
    unpinpost(author: NameType, slug: NameType): Promise<TransactResult> {
        return this.call(
            'unpinpost',
            _Decentiumorg.types.Action_unpinpost.from({author: author, slug: slug})
        )
    }
    unpublish(permlink: _Decentiumorg.types.Permlink): Promise<TransactResult> {
        return this.call(
            'unpublish',
            _Decentiumorg.types.Action_unpublish.from({permlink: permlink})
        )
    }
    updatescore(post_permlink: _Decentiumorg.types.Permlink): Promise<TransactResult> {
        return this.call(
            'updatescore',
            _Decentiumorg.types.Action_updatescore.from({post_permlink: post_permlink})
        )
    }
}
export namespace _Decentiumorg {
    export namespace tables {
        export class blogs {
            static fieldToIndex = {author: {type: 'name', index_position: 'primary'}}
            static query(
                {limit = 10},
                queryParams: _Decentiumorg.types.blogsQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Blog_row>> {
                const blogsTable = Table.from({
                    contract: 'blog',
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.query(queryParams)
            }
            static get(
                queryParams: _Decentiumorg.types.blogsQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Blog_row> {
                const blogsTable = Table.from({
                    contract: 'blog',
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.get(queryParams)
            }
            static all(
                queryParams: _Decentiumorg.types.blogsQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Blog_row>> {
                const blogsTable = Table.from({
                    contract: 'blog',
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.all(queryParams)
            }
        }
        export class links {
            static fieldToIndex = {
                id: {type: 'uint64', index_position: 'primary'},
                from: {type: 'uint128', index_position: 'secondary'},
                to: {type: 'uint128', index_position: 'tertiary'},
            }
            static query(
                {limit = 10},
                queryParams: _Decentiumorg.types.linksQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Link_row>> {
                const linksTable = Table.from({
                    contract: 'blog',
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.query(queryParams)
            }
            static get(
                queryParams: _Decentiumorg.types.linksQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Link_row> {
                const linksTable = Table.from({
                    contract: 'blog',
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.get(queryParams)
            }
            static all(
                queryParams: _Decentiumorg.types.linksQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Link_row>> {
                const linksTable = Table.from({
                    contract: 'blog',
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.all(queryParams)
            }
        }
        export class posts {
            static fieldToIndex = {
                slug: {type: 'name', index_position: 'primary'},
                updated: {type: 'uint64', index_position: 'secondary'},
            }
            static query(
                {limit = 10},
                queryParams: _Decentiumorg.types.postsQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Post_row>> {
                const postsTable = Table.from({
                    contract: 'blog',
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.query(queryParams)
            }
            static get(
                queryParams: _Decentiumorg.types.postsQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Post_row> {
                const postsTable = Table.from({
                    contract: 'blog',
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.get(queryParams)
            }
            static all(
                queryParams: _Decentiumorg.types.postsQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Post_row>> {
                const postsTable = Table.from({
                    contract: 'blog',
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.all(queryParams)
            }
        }
        export class state {
            static fieldToIndex = {}
            static query(
                {limit = 10},
                queryParams: _Decentiumorg.types.stateQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.State>> {
                const stateTable = Table.from({
                    contract: 'blog',
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.query(queryParams)
            }
            static get(
                queryParams: _Decentiumorg.types.stateQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.State> {
                const stateTable = Table.from({
                    contract: 'blog',
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.get(queryParams)
            }
            static all(
                queryParams: _Decentiumorg.types.stateQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.State>> {
                const stateTable = Table.from({
                    contract: 'blog',
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.all(queryParams)
            }
        }
        export class trending {
            static fieldToIndex = {
                id: {type: 'uint64', index_position: 'primary'},
                score: {type: 'uint64', index_position: 'secondary'},
                cscore: {type: 'uint128', index_position: 'tertiary'},
                permlink: {type: 'uint128', index_position: 'fourth'},
            }
            static query(
                {limit = 10},
                queryParams: _Decentiumorg.types.trendingQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Trending_row>> {
                const trendingTable = Table.from({
                    contract: 'blog',
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.query(queryParams)
            }
            static get(
                queryParams: _Decentiumorg.types.trendingQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Trending_row> {
                const trendingTable = Table.from({
                    contract: 'blog',
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.get(queryParams)
            }
            static all(
                queryParams: _Decentiumorg.types.trendingQueryParams,
                client: APIClient
            ): Promise<TableCursor<_Decentiumorg.types.Trending_row>> {
                const trendingTable = Table.from({
                    contract: 'blog',
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.all(queryParams)
            }
        }
    }
}
export namespace _Decentiumorg {
    export namespace types {
        @Struct.type('action_addcategory')
        export class Action_addcategory extends Struct {
            @Struct.field('category')
            declare category: Name
        }
        @Struct.type('action_addmoderator')
        export class Action_addmoderator extends Struct {
            @Struct.field('account')
            declare account: Name
        }
        @Struct.type('action_createblog')
        export class Action_createblog extends Struct {
            @Struct.field('author')
            declare author: Name
        }
        @Struct.type('action_delcategory')
        export class Action_delcategory extends Struct {
            @Struct.field('category')
            declare category: Name
        }
        @Struct.type('action_deleteblog')
        export class Action_deleteblog extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('max_itr')
            declare max_itr: UInt32
        }
        @Struct.type('action_delmoderator')
        export class Action_delmoderator extends Struct {
            @Struct.field('account')
            declare account: Name
        }
        @Struct.type('action_freezeblog')
        export class Action_freezeblog extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('reason')
            declare reason: String
        }
        @Struct.type('action_housekeeping')
        export class Action_housekeeping extends Struct {
            @Struct.field('max_itr')
            declare max_itr: UInt32
        }
        @Struct.type('action_pinpost')
        export class Action_pinpost extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('slug')
            declare slug: Name
        }
        @Struct.type('action_post')
        export class Action_post extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('title')
            declare title: String
            @Struct.field('doc')
            declare doc: _Decentiumorg.types.Document
            @Struct.field('metadata')
            declare metadata: _Decentiumorg.types.Metadata?
        }
        @Struct.type('action_postedit')
        export class Action_postedit extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('new_title')
            declare new_title: String?
            @Struct.field('patch')
            declare patch: String?
            @Struct.field('new_metadata')
            declare new_metadata: _Decentiumorg.types.Metadata?
        }
        @Struct.type('action_profile')
        export class Action_profile extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('name')
            declare name: String
            @Struct.field('bio')
            declare bio: String
            @Struct.field('image')
            declare image: String?
        }
        @Struct.type('action_publish')
        export class Action_publish extends Struct {
            @Struct.field('permlink')
            declare permlink: _Decentiumorg.types.Permlink
            @Struct.field('tx')
            declare tx: _Decentiumorg.types.Tx_ref
            @Struct.field('category')
            declare category: Name
            @Struct.field('options')
            declare options: Post_options
            @Struct.field('links')
            declare links: _Decentiumorg.types.Permlink[]
        }
        @Struct.type('action_publishedit')
        export class Action_publishedit extends Struct {
            @Struct.field('permlink')
            declare permlink: _Decentiumorg.types.Permlink
            @Struct.field('edit_tx')
            declare edit_tx: _Decentiumorg.types.Tx_ref
        }
        @Struct.type('action_setlinkflags')
        export class Action_setlinkflags extends Struct {
            @Struct.field('link_id')
            declare link_id: UInt64
            @Struct.field('new_flags')
            declare new_flags: Link_flags
        }
        @Struct.type('action_setprofile')
        export class Action_setprofile extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('profile')
            declare profile: _Decentiumorg.types.Tx_ref
        }
        @Struct.type('action_unfreezeblog')
        export class Action_unfreezeblog extends Struct {
            @Struct.field('author')
            declare author: Name
        }
        @Struct.type('action_unpinpost')
        export class Action_unpinpost extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('slug')
            declare slug: Name
        }
        @Struct.type('action_unpublish')
        export class Action_unpublish extends Struct {
            @Struct.field('permlink')
            declare permlink: _Decentiumorg.types.Permlink
        }
        @Struct.type('action_updatescore')
        export class Action_updatescore extends Struct {
            @Struct.field('post_permlink')
            declare post_permlink: _Decentiumorg.types.Permlink
        }
        @Struct.type('blog_row')
        export class Blog_row extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('flags')
            declare flags: Blog_flags
            @Struct.field('pinned')
            declare pinned: Name[]
            @Struct.field('stats')
            declare stats: _Decentiumorg.types.Blog_stats
            @Struct.field('profile')
            declare profile: _Decentiumorg.types.Tx_ref?
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions[]
        }
        @Struct.type('blog_stats')
        export class Blog_stats extends Struct {
            @Struct.field('total_posts')
            declare total_posts: UInt32
            @Struct.field('endorsements_received')
            declare endorsements_received: _Decentiumorg.types.Reward_stat
            @Struct.field('endorsements_sent')
            declare endorsements_sent: _Decentiumorg.types.Reward_stat
            @Struct.field('incoming_linkbacks')
            declare incoming_linkbacks: _Decentiumorg.types.Reward_stat
            @Struct.field('outgoing_linkbacks')
            declare outgoing_linkbacks: _Decentiumorg.types.Reward_stat
        }
        @Struct.type('bold')
        export class Bold extends Struct {}
        @Struct.type('category_stat')
        export class Category_stat extends Struct {
            @Struct.field('endorsements')
            declare endorsements: _Decentiumorg.types.Reward_stat
            @Struct.field('linkbacks')
            declare linkbacks: _Decentiumorg.types.Reward_stat
        }
        @Struct.type('code')
        export class Code extends Struct {}
        @Struct.type('code_block')
        export class Code_block extends Struct {
            @Struct.field('code')
            declare code: String
            @Struct.field('lang')
            declare lang: String
        }
        @Struct.type('color')
        export class Color extends Struct {
            @Struct.field('r')
            declare r: UInt8
            @Struct.field('g')
            declare g: UInt8
            @Struct.field('b')
            declare b: UInt8
        }
        @Struct.type('divider')
        export class Divider extends Struct {}
        @Struct.type('document')
        export class Document extends Struct {
            @Struct.field('content')
            declare content: Variant_block_nodes[]
        }
        @Struct.type('future_extensions')
        export class Future_extensions extends Struct {}
        @Struct.type('geometrize_triangles')
        export class Geometrize_triangles extends Struct {
            @Struct.field('base')
            declare base: _Decentiumorg.types.Color
            @Struct.field('triangles')
            declare triangles: _Decentiumorg.types.Triangle[]
        }
        @Struct.type('hard_break')
        export class Hard_break extends Struct {}
        @Struct.type('heading')
        export class Heading extends Struct {
            @Struct.field('value')
            declare value: String
            @Struct.field('level')
            declare level: UInt8
        }
        @Struct.type('image')
        export class Image extends Struct {
            @Struct.field('src')
            declare src: String
            @Struct.field('caption')
            declare caption: Variant_inline_nodes[]
            @Struct.field('layout')
            declare layout: UInt8
        }
        @Struct.type('image_info')
        export class Image_info extends Struct {
            @Struct.field('width')
            declare width: UInt16
            @Struct.field('height')
            declare height: UInt16
            @Struct.field('placeholder')
            declare placeholder: Variant_placeholder
        }
        @Struct.type('italic')
        export class Italic extends Struct {}
        @Struct.type('link')
        export class Link extends Struct {
            @Struct.field('href')
            declare href: String
            @Struct.field('title')
            declare title: String
        }
        @Struct.type('link_row')
        export class Link_row extends Struct {
            @Struct.field('id')
            declare id: UInt64
            @Struct.field('from')
            declare from: _Decentiumorg.types.Permlink
            @Struct.field('to')
            declare to: _Decentiumorg.types.Permlink
            @Struct.field('flags')
            declare flags: Link_flags
            @Struct.field('payment')
            declare payment: Asset?
        }
        @Struct.type('linkref')
        export class Linkref extends Struct {
            @Struct.field('to')
            declare to: _Decentiumorg.types.Permlink
        }
        @Struct.type('list')
        export class List extends Struct {
            @Struct.field('type')
            declare type: UInt8
            @Struct.field('items')
            declare items: _Decentiumorg.types.List_item[]
        }
        @Struct.type('list_item')
        export class List_item extends Struct {
            @Struct.field('content')
            declare content: Variant_inline_nodes[]
        }
        @Struct.type('metadata')
        export class Metadata extends Struct {
            @Struct.field('image')
            declare image: String?
            @Struct.field('summary')
            declare summary: String?
            @Struct.field('image_info')
            declare image_info: _Decentiumorg.types.Pair_string_image_info[]
        }
        @Struct.type('pair_name_category_stat')
        export class Pair_name_category_stat extends Struct {
            @Struct.field('key')
            declare key: Name
            @Struct.field('value')
            declare value: _Decentiumorg.types.Category_stat
        }
        @Struct.type('pair_string_image_info')
        export class Pair_string_image_info extends Struct {
            @Struct.field('key')
            declare key: String
            @Struct.field('value')
            declare value: _Decentiumorg.types.Image_info
        }
        @Struct.type('paragraph')
        export class Paragraph extends Struct {
            @Struct.field('content')
            declare content: Variant_inline_nodes[]
        }
        @Struct.type('permlink')
        export class Permlink extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('slug')
            declare slug: Name
        }
        @Struct.type('post_ref')
        export class Post_ref extends Struct {
            @Struct.field('permlink')
            declare permlink: _Decentiumorg.types.Permlink
            @Struct.field('timestamp')
            declare timestamp: TimePointSec
            @Struct.field('category')
            declare category: Name
            @Struct.field('options')
            declare options: Post_options
            @Struct.field('tx')
            declare tx: _Decentiumorg.types.Tx_ref
            @Struct.field('edit_tx')
            declare edit_tx: _Decentiumorg.types.Tx_ref?
            @Struct.field('endorsements')
            declare endorsements: _Decentiumorg.types.Reward_stat?
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions[]
        }
        @Struct.type('post_row')
        export class Post_row extends Struct {
            @Struct.field('ref')
            declare ref: _Decentiumorg.types.Post_ref
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions[]
        }
        @Struct.type('quote')
        export class Quote extends Struct {
            @Struct.field('content')
            declare content: Variant_inline_nodes[]
        }
        @Struct.type('reward_stat')
        export class Reward_stat extends Struct {
            @Struct.field('count')
            declare count: UInt32
            @Struct.field('amount')
            declare amount: UInt64
        }
        @Struct.type('state')
        export class State extends Struct {
            @Struct.field('moderators')
            declare moderators: Name[]
            @Struct.field('categories')
            declare categories: _Decentiumorg.types.Pair_name_category_stat[]
        }
        @Struct.type('strike')
        export class Strike extends Struct {}
        @Struct.type('text')
        export class Text extends Struct {
            @Struct.field('value')
            declare value: String
            @Struct.field('marks')
            declare marks: Variant_mark_nodes[]
        }
        @Struct.type('trending_row')
        export class Trending_row extends Struct {
            @Struct.field('id')
            declare id: UInt64
            @Struct.field('score')
            declare score: UInt64
            @Struct.field('ref')
            declare ref: _Decentiumorg.types.Post_ref
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions[]
        }
        @Struct.type('triangle')
        export class Triangle extends Struct {
            @Struct.field('ax')
            declare ax: UInt8
            @Struct.field('ay')
            declare ay: UInt8
            @Struct.field('bx')
            declare bx: UInt8
            @Struct.field('by')
            declare by: UInt8
            @Struct.field('cx')
            declare cx: UInt8
            @Struct.field('cy')
            declare cy: UInt8
            @Struct.field('color')
            declare color: _Decentiumorg.types.Color
        }
        @Struct.type('tx_ref')
        export class Tx_ref extends Struct {
            @Struct.field('block_num')
            declare block_num: UInt32
            @Struct.field('transaction_id')
            declare transaction_id: Checksum256
        }
    }
}
