import {Contract, Table, TableCursor, GetTableRowsOptions} from '../src/index'
import {
    APIClient,
    Asset,
    AssetType,
    Checksum256,
    Name,
    NameType,
    Session,
    Struct,
    TimePointSec,
    TransactResult,
    UInt16,
    UInt16Type,
    UInt32,
    UInt32Type,
    UInt64,
    UInt64Type,
    UInt8,
    UInt8Type,
} from '@wharfkit/session'
export class _Decentiumorg extends Contract {
    addcategory(
        addcategoryParams: _Decentiumorg.types.AddcategoryParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'addcategory',
            _Decentiumorg.types.Action_addcategory.from(addcategoryParams),
            session
        )
    }
    addmoderator(
        addmoderatorParams: _Decentiumorg.types.AddmoderatorParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'addmoderator',
            _Decentiumorg.types.Action_addmoderator.from(addmoderatorParams),
            session
        )
    }
    createblog(
        createblogParams: _Decentiumorg.types.CreateblogParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'createblog',
            _Decentiumorg.types.Action_createblog.from(createblogParams),
            session
        )
    }
    delcategory(
        delcategoryParams: _Decentiumorg.types.DelcategoryParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'delcategory',
            _Decentiumorg.types.Action_delcategory.from(delcategoryParams),
            session
        )
    }
    deleteblog(
        deleteblogParams: _Decentiumorg.types.DeleteblogParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'deleteblog',
            _Decentiumorg.types.Action_deleteblog.from(deleteblogParams),
            session
        )
    }
    delmoderator(
        delmoderatorParams: _Decentiumorg.types.DelmoderatorParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'delmoderator',
            _Decentiumorg.types.Action_delmoderator.from(delmoderatorParams),
            session
        )
    }
    freezeblog(
        freezeblogParams: _Decentiumorg.types.FreezeblogParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'freezeblog',
            _Decentiumorg.types.Action_freezeblog.from(freezeblogParams),
            session
        )
    }
    housekeeping(
        housekeepingParams: _Decentiumorg.types.HousekeepingParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'housekeeping',
            _Decentiumorg.types.Action_housekeeping.from(housekeepingParams),
            session
        )
    }
    pinpost(
        pinpostParams: _Decentiumorg.types.PinpostParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call('pinpost', _Decentiumorg.types.Action_pinpost.from(pinpostParams), session)
    }
    post(postParams: _Decentiumorg.types.PostParams, session: Session): Promise<TransactResult> {
        return this.call('post', _Decentiumorg.types.Action_pinpost.from(postParams), session)
    }
    postedit(
        posteditParams: _Decentiumorg.types.PosteditParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'postedit',
            _Decentiumorg.types.Action_postedit.from(posteditParams),
            session
        )
    }
    profile(
        profileParams: _Decentiumorg.types.ProfileParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call('profile', _Decentiumorg.types.Action_profile.from(profileParams), session)
    }
    publish(
        publishParams: _Decentiumorg.types.PublishParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call('publish', _Decentiumorg.types.Action_publish.from(publishParams), session)
    }
    publishedit(
        publisheditParams: _Decentiumorg.types.PublisheditParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'publishedit',
            _Decentiumorg.types.Action_publishedit.from(publisheditParams),
            session
        )
    }
    setlinkflags(
        setlinkflagsParams: _Decentiumorg.types.SetlinkflagsParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'setlinkflags',
            _Decentiumorg.types.Action_setlinkflags.from(setlinkflagsParams),
            session
        )
    }
    setprofile(
        setprofileParams: _Decentiumorg.types.SetprofileParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'setprofile',
            _Decentiumorg.types.Action_setprofile.from(setprofileParams),
            session
        )
    }
    unfreezeblog(
        unfreezeblogParams: _Decentiumorg.types.UnfreezeblogParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'unfreezeblog',
            _Decentiumorg.types.Action_unfreezeblog.from(unfreezeblogParams),
            session
        )
    }
    unpinpost(
        unpinpostParams: _Decentiumorg.types.UnpinpostParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'unpinpost',
            _Decentiumorg.types.Action_unpinpost.from(unpinpostParams),
            session
        )
    }
    unpublish(
        unpublishParams: _Decentiumorg.types.UnpublishParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'unpublish',
            _Decentiumorg.types.Action_unpublish.from(unpublishParams),
            session
        )
    }
    updatescore(
        updatescoreParams: _Decentiumorg.types.UpdatescoreParams,
        session: Session
    ): Promise<TransactResult> {
        return this.call(
            'updatescore',
            _Decentiumorg.types.Action_updatescore.from(updatescoreParams),
            session
        )
    }
}
export namespace _Decentiumorg {
    export namespace tables {
        export class blogs {
            static contract = Contract.from({name: 'decentiumorg'})
            static fieldToIndex = {author: {type: 'name', index_position: 'primary'}}
            static where(
                queryParams: _Decentiumorg.types.BlogsWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Blog_row> {
                const blogsTable = Table.from({
                    contract: blogs.contract,
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.where(queryParams, getTableRowsOptions)
            }
            static find(
                queryParams: _Decentiumorg.types.BlogsFindQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Blog_row> {
                const blogsTable = Table.from({
                    contract: blogs.contract,
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.find(queryParams)
            }
            static first(
                limit: number,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Blog_row> {
                const blogsTable = Table.from({
                    contract: blogs.contract,
                    name: 'blogs',
                    client: client,
                    rowType: _Decentiumorg.types.Blog_row,
                    fieldToIndex: blogs.fieldToIndex,
                })
                return blogsTable.first(limit)
            }
        }
        export class links {
            static contract = Contract.from({name: 'decentiumorg'})
            static fieldToIndex = {
                id: {type: 'uint64', index_position: 'primary'},
                from: {type: 'uint128', index_position: 'secondary'},
                to: {type: 'uint128', index_position: 'tertiary'},
            }
            static where(
                queryParams: _Decentiumorg.types.LinksWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Link_row> {
                const linksTable = Table.from({
                    contract: links.contract,
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.where(queryParams, getTableRowsOptions)
            }
            static find(
                queryParams: _Decentiumorg.types.LinksFindQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Link_row> {
                const linksTable = Table.from({
                    contract: links.contract,
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.find(queryParams)
            }
            static first(
                limit: number,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Link_row> {
                const linksTable = Table.from({
                    contract: links.contract,
                    name: 'links',
                    client: client,
                    rowType: _Decentiumorg.types.Link_row,
                    fieldToIndex: links.fieldToIndex,
                })
                return linksTable.first(limit)
            }
        }
        export class posts {
            static contract = Contract.from({name: 'decentiumorg'})
            static fieldToIndex = {
                slug: {type: 'name', index_position: 'primary'},
                updated: {type: 'uint64', index_position: 'secondary'},
            }
            static where(
                queryParams: _Decentiumorg.types.PostsWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Post_row> {
                const postsTable = Table.from({
                    contract: posts.contract,
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.where(queryParams, getTableRowsOptions)
            }
            static find(
                queryParams: _Decentiumorg.types.PostsFindQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Post_row> {
                const postsTable = Table.from({
                    contract: posts.contract,
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.find(queryParams)
            }
            static first(
                limit: number,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Post_row> {
                const postsTable = Table.from({
                    contract: posts.contract,
                    name: 'posts',
                    client: client,
                    rowType: _Decentiumorg.types.Post_row,
                    fieldToIndex: posts.fieldToIndex,
                })
                return postsTable.first(limit)
            }
        }
        export class state {
            static contract = Contract.from({name: 'decentiumorg'})
            static fieldToIndex = {}
            static where(
                queryParams: _Decentiumorg.types.StateWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.State> {
                const stateTable = Table.from({
                    contract: state.contract,
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.where(queryParams, getTableRowsOptions)
            }
            static find(
                queryParams: _Decentiumorg.types.StateFindQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.State> {
                const stateTable = Table.from({
                    contract: state.contract,
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.find(queryParams)
            }
            static first(limit: number, client: APIClient): TableCursor<_Decentiumorg.types.State> {
                const stateTable = Table.from({
                    contract: state.contract,
                    name: 'state',
                    client: client,
                    rowType: _Decentiumorg.types.State,
                    fieldToIndex: state.fieldToIndex,
                })
                return stateTable.first(limit)
            }
        }
        export class trending {
            static contract = Contract.from({name: 'decentiumorg'})
            static fieldToIndex = {
                id: {type: 'uint64', index_position: 'primary'},
                score: {type: 'uint64', index_position: 'secondary'},
                cscore: {type: 'uint128', index_position: 'tertiary'},
                permlink: {type: 'uint128', index_position: 'fourth'},
            }
            static where(
                queryParams: _Decentiumorg.types.TrendingWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Trending_row> {
                const trendingTable = Table.from({
                    contract: trending.contract,
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.where(queryParams, getTableRowsOptions)
            }
            static find(
                queryParams: _Decentiumorg.types.TrendingFindQueryParams,
                client: APIClient
            ): Promise<_Decentiumorg.types.Trending_row> {
                const trendingTable = Table.from({
                    contract: trending.contract,
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.find(queryParams)
            }
            static first(
                limit: number,
                client: APIClient
            ): TableCursor<_Decentiumorg.types.Trending_row> {
                const trendingTable = Table.from({
                    contract: trending.contract,
                    name: 'trending',
                    client: client,
                    rowType: _Decentiumorg.types.Trending_row,
                    fieldToIndex: trending.fieldToIndex,
                })
                return trendingTable.first(limit)
            }
        }
    }
}
export namespace _Decentiumorg {
    export namespace types {
        export interface AddcategoryParams {
            category: NameType
        }
        export interface AddmoderatorParams {
            account: NameType
        }
        export interface CreateblogParams {
            author: NameType
        }
        export interface DelcategoryParams {
            category: NameType
        }
        export interface DeleteblogParams {
            author: NameType
            max_itr: UInt32Type
        }
        export interface DelmoderatorParams {
            account: NameType
        }
        export interface FreezeblogParams {
            author: NameType
            reason: String
        }
        export interface HousekeepingParams {
            max_itr: UInt32Type
        }
        export interface PinpostParams {
            author: NameType
            slug: NameType
        }
        export interface PostParams {
            author: NameType
            slug: NameType
        }
        export interface PosteditParams {
            author: NameType
            new_title: String
            patch: String
            new_metadata: Metadata
        }
        export interface ProfileParams {
            author: NameType
            name: String
            bio: String
            image: String
        }
        export interface PublishParams {
            permlink: Permlink
            tx: Tx_ref
            category: NameType
            options: Post_options
            links: Permlink
        }
        export interface PublisheditParams {
            permlink: Permlink
            edit_tx: Tx_ref
        }
        export interface SetlinkflagsParams {
            link_id: UInt64Type
            new_flags: Link_flags
        }
        export interface SetprofileParams {
            author: NameType
            profile: Tx_ref
        }
        export interface UnfreezeblogParams {
            author: NameType
        }
        export interface UnpinpostParams {
            author: NameType
            slug: NameType
        }
        export interface UnpublishParams {
            permlink: Permlink
        }
        export interface UpdatescoreParams {
            post_permlink: Permlink
        }
        export interface BlogsWhereQueryParams {
            author?: {
                from: NameType
                to: NameType
            }
            flags?: {
                from: Blog_flags
                to: Blog_flags
            }
            pinned?: {
                from: NameType
                to: NameType
            }
            stats?: {
                from: Blog_stats
                to: Blog_stats
            }
            profile?: {
                from: Tx_ref
                to: Tx_ref
            }
            extensions?: {
                from: Future_extensions
                to: Future_extensions
            }
        }
        export interface BlogsFindQueryParams {
            author?: NameType
            flags?: Blog_flags
            pinned?: NameType
            stats?: Blog_stats
            profile?: Tx_ref
            extensions?: Future_extensions
        }
        export interface LinksWhereQueryParams {
            id?: {
                from: UInt64Type
                to: UInt64Type
            }
            from?: {
                from: Permlink
                to: Permlink
            }
            to?: {
                from: Permlink
                to: Permlink
            }
            flags?: {
                from: Link_flags
                to: Link_flags
            }
            payment?: {
                from: AssetType
                to: AssetType
            }
        }
        export interface LinksFindQueryParams {
            id?: UInt64Type
            from?: Permlink
            to?: Permlink
            flags?: Link_flags
            payment?: AssetType
        }
        export interface PostsWhereQueryParams {
            ref?: {
                from: Post_ref
                to: Post_ref
            }
            extensions?: {
                from: Future_extensions
                to: Future_extensions
            }
        }
        export interface PostsFindQueryParams {
            ref?: Post_ref
            extensions?: Future_extensions
        }
        export interface StateWhereQueryParams {
            moderators?: {
                from: NameType
                to: NameType
            }
            categories?: {
                from: Pair_name_category_stat
                to: Pair_name_category_stat
            }
        }
        export interface StateFindQueryParams {
            moderators?: NameType
            categories?: Pair_name_category_stat
        }
        export interface TrendingWhereQueryParams {
            id?: {
                from: UInt64Type
                to: UInt64Type
            }
            score?: {
                from: UInt64Type
                to: UInt64Type
            }
            ref?: {
                from: Post_ref
                to: Post_ref
            }
            extensions?: {
                from: Future_extensions
                to: Future_extensions
            }
        }
        export interface TrendingFindQueryParams {
            id?: UInt64Type
            score?: UInt64Type
            ref?: Post_ref
            extensions?: Future_extensions
        }
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
            declare metadata: _Decentiumorg.types.Metadata
        }
        @Struct.type('action_postedit')
        export class Action_postedit extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('new_title')
            declare new_title: String
            @Struct.field('patch')
            declare patch: String
            @Struct.field('new_metadata')
            declare new_metadata: _Decentiumorg.types.Metadata
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
            declare image: String
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
            declare links: _Decentiumorg.types.Permlink
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
            declare pinned: Name
            @Struct.field('stats')
            declare stats: _Decentiumorg.types.Blog_stats
            @Struct.field('profile')
            declare profile: _Decentiumorg.types.Tx_ref
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions
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
            declare content: Variant_block_nodes
        }
        @Struct.type('future_extensions')
        export class Future_extensions extends Struct {}
        @Struct.type('geometrize_triangles')
        export class Geometrize_triangles extends Struct {
            @Struct.field('base')
            declare base: _Decentiumorg.types.Color
            @Struct.field('triangles')
            declare triangles: _Decentiumorg.types.Triangle
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
            declare caption: Variant_inline_nodes
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
            declare payment: Asset
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
            declare items: _Decentiumorg.types.List_item
        }
        @Struct.type('list_item')
        export class List_item extends Struct {
            @Struct.field('content')
            declare content: Variant_inline_nodes
        }
        @Struct.type('metadata')
        export class Metadata extends Struct {
            @Struct.field('image')
            declare image: String
            @Struct.field('summary')
            declare summary: String
            @Struct.field('image_info')
            declare image_info: _Decentiumorg.types.Pair_string_image_info
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
            declare content: Variant_inline_nodes
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
            declare edit_tx: _Decentiumorg.types.Tx_ref
            @Struct.field('endorsements')
            declare endorsements: _Decentiumorg.types.Reward_stat
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions
        }
        @Struct.type('post_row')
        export class Post_row extends Struct {
            @Struct.field('ref')
            declare ref: _Decentiumorg.types.Post_ref
            @Struct.field('extensions')
            declare extensions: _Decentiumorg.types.Future_extensions
        }
        @Struct.type('quote')
        export class Quote extends Struct {
            @Struct.field('content')
            declare content: Variant_inline_nodes
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
            declare moderators: Name
            @Struct.field('categories')
            declare categories: _Decentiumorg.types.Pair_name_category_stat
        }
        @Struct.type('strike')
        export class Strike extends Struct {}
        @Struct.type('text')
        export class Text extends Struct {
            @Struct.field('value')
            declare value: String
            @Struct.field('marks')
            declare marks: Variant_mark_nodes
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
            declare extensions: _Decentiumorg.types.Future_extensions
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
