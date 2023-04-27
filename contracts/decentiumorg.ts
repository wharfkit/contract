import {Contract} from '@wharfkit/contract'
import {
    Struct,
    Name,
    NameType,
    Asset,
    AssetType,
    UInt32,
    UInt32Type,
    UInt64,
    UInt64Type,
    TransactResult,
} from '@wharfkit/session'
export class _Decentiumorg extends Contract {
    addcategory(category: NameType): Promise<TransactResult> {
        return this.call('addcategory', _Decentiumorg.Types.Addcategory.from({category: category}))
    }
    addmoderator(account: NameType): Promise<TransactResult> {
        return this.call('addmoderator', _Decentiumorg.Types.Addmoderator.from({account: account}))
    }
    createblog(author: NameType): Promise<TransactResult> {
        return this.call('createblog', _Decentiumorg.Types.Createblog.from({author: author}))
    }
    delcategory(category: NameType): Promise<TransactResult> {
        return this.call('delcategory', _Decentiumorg.Types.Delcategory.from({category: category}))
    }
    deleteblog(author: NameType, max_itr: UInt32Type): Promise<TransactResult> {
        return this.call(
            'deleteblog',
            _Decentiumorg.Types.Deleteblog.from({author: author, max_itr: max_itr})
        )
    }
    delmoderator(account: NameType): Promise<TransactResult> {
        return this.call('delmoderator', _Decentiumorg.Types.Delmoderator.from({account: account}))
    }
    freezeblog(author: NameType, reason: string): Promise<TransactResult> {
        return this.call(
            'freezeblog',
            _Decentiumorg.Types.Freezeblog.from({author: author, reason: reason})
        )
    }
    housekeeping(max_itr: UInt32Type): Promise<TransactResult> {
        return this.call('housekeeping', _Decentiumorg.Types.Housekeeping.from({max_itr: max_itr}))
    }
    pinpost(author: NameType, slug: NameType): Promise<TransactResult> {
        return this.call('pinpost', _Decentiumorg.Types.Pinpost.from({author: author, slug: slug}))
    }
    post(
        author: NameType,
        title: string,
        doc: document,
        metadata: metadata
    ): Promise<TransactResult> {
        return this.call(
            'post',
            _Decentiumorg.Types.Post.from({
                author: author,
                title: title,
                doc: doc,
                metadata: metadata,
            })
        )
    }
    postedit(
        author: NameType,
        new_title: string,
        patch: string,
        new_metadata: metadata
    ): Promise<TransactResult> {
        return this.call(
            'postedit',
            _Decentiumorg.Types.Postedit.from({
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
            _Decentiumorg.Types.Profile.from({author: author, name: name, bio: bio, image: image})
        )
    }
    publish(
        permlink: permlink,
        tx: tx_ref,
        category: NameType,
        options: post_options,
        links: permlink
    ): Promise<TransactResult> {
        return this.call(
            'publish',
            _Decentiumorg.Types.Publish.from({
                permlink: permlink,
                tx: tx,
                category: category,
                options: options,
                links: links,
            })
        )
    }
    publishedit(permlink: permlink, edit_tx: tx_ref): Promise<TransactResult> {
        return this.call(
            'publishedit',
            _Decentiumorg.Types.Publishedit.from({permlink: permlink, edit_tx: edit_tx})
        )
    }
    setlinkflags(link_id: UInt64Type, new_flags: link_flags): Promise<TransactResult> {
        return this.call(
            'setlinkflags',
            _Decentiumorg.Types.Setlinkflags.from({link_id: link_id, new_flags: new_flags})
        )
    }
    setprofile(author: NameType, profile: tx_ref): Promise<TransactResult> {
        return this.call(
            'setprofile',
            _Decentiumorg.Types.Setprofile.from({author: author, profile: profile})
        )
    }
    unfreezeblog(author: NameType): Promise<TransactResult> {
        return this.call('unfreezeblog', _Decentiumorg.Types.Unfreezeblog.from({author: author}))
    }
    unpinpost(author: NameType, slug: NameType): Promise<TransactResult> {
        return this.call(
            'unpinpost',
            _Decentiumorg.Types.Unpinpost.from({author: author, slug: slug})
        )
    }
    unpublish(permlink: permlink): Promise<TransactResult> {
        return this.call('unpublish', _Decentiumorg.Types.Unpublish.from({permlink: permlink}))
    }
    updatescore(post_permlink: permlink): Promise<TransactResult> {
        return this.call(
            'updatescore',
            _Decentiumorg.Types.Updatescore.from({post_permlink: post_permlink})
        )
    }
}
export namespace _Decentiumorg {
    export namespace Types {
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
            declare reason: string
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
            declare title: string
            @Struct.field('doc')
            declare doc: document
            @Struct.field('metadata')
            declare metadata: metadata?
        }
        @Struct.type('action_postedit')
        export class Action_postedit extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('new_title')
            declare new_title: string?
            @Struct.field('patch')
            declare patch: string?
            @Struct.field('new_metadata')
            declare new_metadata: metadata?
        }
        @Struct.type('action_profile')
        export class Action_profile extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('name')
            declare name: string
            @Struct.field('bio')
            declare bio: string
            @Struct.field('image')
            declare image: string?
        }
        @Struct.type('action_publish')
        export class Action_publish extends Struct {
            @Struct.field('permlink')
            declare permlink: permlink
            @Struct.field('tx')
            declare tx: tx_ref
            @Struct.field('category')
            declare category: Name
            @Struct.field('options')
            declare options: post_options
            @Struct.field('links')
            declare links: permlink[]
        }
        @Struct.type('action_publishedit')
        export class Action_publishedit extends Struct {
            @Struct.field('permlink')
            declare permlink: permlink
            @Struct.field('edit_tx')
            declare edit_tx: tx_ref
        }
        @Struct.type('action_setlinkflags')
        export class Action_setlinkflags extends Struct {
            @Struct.field('link_id')
            declare link_id: UInt64
            @Struct.field('new_flags')
            declare new_flags: link_flags
        }
        @Struct.type('action_setprofile')
        export class Action_setprofile extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('profile')
            declare profile: tx_ref
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
            declare permlink: permlink
        }
        @Struct.type('action_updatescore')
        export class Action_updatescore extends Struct {
            @Struct.field('post_permlink')
            declare post_permlink: permlink
        }
        @Struct.type('blog_row')
        export class Blog_row extends Struct {
            @Struct.field('author')
            declare author: Name
            @Struct.field('flags')
            declare flags: blog_flags
            @Struct.field('pinned')
            declare pinned: name[]
            @Struct.field('stats')
            declare stats: blog_stats
            @Struct.field('profile')
            declare profile: tx_ref?
            @Struct.field('extensions')
            declare extensions: future_extensions[]
        }
        @Struct.type('blog_stats')
        export class Blog_stats extends Struct {
            @Struct.field('total_posts')
            declare total_posts: UInt32
            @Struct.field('endorsements_received')
            declare endorsements_received: reward_stat
            @Struct.field('endorsements_sent')
            declare endorsements_sent: reward_stat
            @Struct.field('incoming_linkbacks')
            declare incoming_linkbacks: reward_stat
            @Struct.field('outgoing_linkbacks')
            declare outgoing_linkbacks: reward_stat
        }
        @Struct.type('bold')
        export class Bold extends Struct {}
        @Struct.type('category_stat')
        export class Category_stat extends Struct {
            @Struct.field('endorsements')
            declare endorsements: reward_stat
            @Struct.field('linkbacks')
            declare linkbacks: reward_stat
        }
        @Struct.type('code')
        export class Code extends Struct {}
        @Struct.type('code_block')
        export class Code_block extends Struct {
            @Struct.field('code')
            declare code: string
            @Struct.field('lang')
            declare lang: string
        }
        @Struct.type('color')
        export class Color extends Struct {
            @Struct.field('r')
            declare r: uint8
            @Struct.field('g')
            declare g: uint8
            @Struct.field('b')
            declare b: uint8
        }
        @Struct.type('divider')
        export class Divider extends Struct {}
        @Struct.type('document')
        export class Document extends Struct {
            @Struct.field('content')
            declare content: variant_block_nodes[]
        }
        @Struct.type('future_extensions')
        export class Future_extensions extends Struct {}
        @Struct.type('geometrize_triangles')
        export class Geometrize_triangles extends Struct {
            @Struct.field('base')
            declare base: color
            @Struct.field('triangles')
            declare triangles: triangle[]
        }
        @Struct.type('hard_break')
        export class Hard_break extends Struct {}
        @Struct.type('heading')
        export class Heading extends Struct {
            @Struct.field('value')
            declare value: string
            @Struct.field('level')
            declare level: uint8
        }
        @Struct.type('image')
        export class Image extends Struct {
            @Struct.field('src')
            declare src: string
            @Struct.field('caption')
            declare caption: variant_inline_nodes[]
            @Struct.field('layout')
            declare layout: uint8
        }
        @Struct.type('image_info')
        export class Image_info extends Struct {
            @Struct.field('width')
            declare width: uint16
            @Struct.field('height')
            declare height: uint16
            @Struct.field('placeholder')
            declare placeholder: variant_placeholder
        }
        @Struct.type('italic')
        export class Italic extends Struct {}
        @Struct.type('link')
        export class Link extends Struct {
            @Struct.field('href')
            declare href: string
            @Struct.field('title')
            declare title: string
        }
        @Struct.type('link_row')
        export class Link_row extends Struct {
            @Struct.field('id')
            declare id: UInt64
            @Struct.field('from')
            declare from: permlink
            @Struct.field('to')
            declare to: permlink
            @Struct.field('flags')
            declare flags: link_flags
            @Struct.field('payment')
            declare payment: asset?
        }
        @Struct.type('linkref')
        export class Linkref extends Struct {
            @Struct.field('to')
            declare to: permlink
        }
        @Struct.type('list')
        export class List extends Struct {
            @Struct.field('type')
            declare type: uint8
            @Struct.field('items')
            declare items: list_item[]
        }
        @Struct.type('list_item')
        export class List_item extends Struct {
            @Struct.field('content')
            declare content: variant_inline_nodes[]
        }
        @Struct.type('metadata')
        export class Metadata extends Struct {
            @Struct.field('image')
            declare image: string?
            @Struct.field('summary')
            declare summary: string?
            @Struct.field('image_info')
            declare image_info: pair_string_image_info[]
        }
        @Struct.type('pair_name_category_stat')
        export class Pair_name_category_stat extends Struct {
            @Struct.field('key')
            declare key: Name
            @Struct.field('value')
            declare value: category_stat
        }
        @Struct.type('pair_string_image_info')
        export class Pair_string_image_info extends Struct {
            @Struct.field('key')
            declare key: string
            @Struct.field('value')
            declare value: image_info
        }
        @Struct.type('paragraph')
        export class Paragraph extends Struct {
            @Struct.field('content')
            declare content: variant_inline_nodes[]
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
            declare permlink: permlink
            @Struct.field('timestamp')
            declare timestamp: time_point_sec
            @Struct.field('category')
            declare category: Name
            @Struct.field('options')
            declare options: post_options
            @Struct.field('tx')
            declare tx: tx_ref
            @Struct.field('edit_tx')
            declare edit_tx: tx_ref?
            @Struct.field('endorsements')
            declare endorsements: reward_stat?
            @Struct.field('extensions')
            declare extensions: future_extensions[]
        }
        @Struct.type('post_row')
        export class Post_row extends Struct {
            @Struct.field('ref')
            declare ref: post_ref
            @Struct.field('extensions')
            declare extensions: future_extensions[]
        }
        @Struct.type('quote')
        export class Quote extends Struct {
            @Struct.field('content')
            declare content: variant_inline_nodes[]
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
            declare moderators: name[]
            @Struct.field('categories')
            declare categories: pair_name_category_stat[]
        }
        @Struct.type('strike')
        export class Strike extends Struct {}
        @Struct.type('text')
        export class Text extends Struct {
            @Struct.field('value')
            declare value: string
            @Struct.field('marks')
            declare marks: variant_mark_nodes[]
        }
        @Struct.type('trending_row')
        export class Trending_row extends Struct {
            @Struct.field('id')
            declare id: UInt64
            @Struct.field('score')
            declare score: UInt64
            @Struct.field('ref')
            declare ref: post_ref
            @Struct.field('extensions')
            declare extensions: future_extensions[]
        }
        @Struct.type('triangle')
        export class Triangle extends Struct {
            @Struct.field('ax')
            declare ax: uint8
            @Struct.field('ay')
            declare ay: uint8
            @Struct.field('bx')
            declare bx: uint8
            @Struct.field('by')
            declare by: uint8
            @Struct.field('cx')
            declare cx: uint8
            @Struct.field('cy')
            declare cy: uint8
            @Struct.field('color')
            declare color: color
        }
        @Struct.type('tx_ref')
        export class Tx_ref extends Struct {
            @Struct.field('block_num')
            declare block_num: UInt32
            @Struct.field('transaction_id')
            declare transaction_id: checksum256
        }
    }
}
