import * as helpers from './helpers';
import { Application, Request, Response } from 'express';

export default function(app: Application, name: string, middleware: any, controllers: any): void {
    const middlewares = [middleware.exposeUid, middleware.canViewUsers];
    const accountMiddlewares = [
        middleware.exposeUid,
        middleware.ensureLoggedIn,
        middleware.canViewUsers,
        middleware.checkAccountPermissions,
    ];
    helpers.setupPageRoute(app, '/me', [], middleware.redirectMeToUserslug);
    helpers.setupPageRoute(app, '/me/*', [], middleware.redirectMeToUserslug);
    helpers.setupPageRoute(app, '/uid/:uid*', [], middleware.redirectUidToUserslug);
    helpers.setupPageRoute(app, `/${name}/:userslug`, middlewares, controllers.accounts.profile.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/following`, middlewares, controllers.accounts.follow.getFollowing);
    helpers.setupPageRoute(app, `/${name}/:userslug/followers`, middlewares, controllers.accounts.follow.getFollowers);
    helpers.setupPageRoute(app, `/${name}/:userslug/posts`, middlewares, controllers.accounts.posts.getPosts);
    helpers.setupPageRoute(app, `/${name}/:userslug/topics`, middlewares, controllers.accounts.posts.getTopics);
    helpers.setupPageRoute(app, `/${name}/:userslug/best`, middlewares, controllers.accounts.posts.getBestPosts);
    helpers.setupPageRoute(app, `/${name}/:userslug/controversial`, middlewares, controllers.accounts.posts.getControversialPosts);
    helpers.setupPageRoute(app, `/${name}/:userslug/groups`, middlewares, controllers.accounts.groups.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/categories`, accountMiddlewares, controllers.accounts.categories.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/bookmarks`, accountMiddlewares, controllers.accounts.posts.getBookmarks);
    helpers.setupPageRoute(app, `/${name}/:userslug/watched`, accountMiddlewares, controllers.accounts.posts.getWatchedTopics);
    helpers.setupPageRoute(app, `/${name}/:userslug/ignored`, accountMiddlewares, controllers.accounts.posts.getIgnoredTopics);
    helpers.setupPageRoute(app, `/${name}/:userslug/upvoted`, accountMiddlewares, controllers.accounts.posts.getUpVotedPosts);
    helpers.setupPageRoute(app, `/${name}/:userslug/downvoted`, accountMiddlewares, controllers.accounts.posts.getDownVotedPosts);
    helpers.setupPageRoute(app, `/${name}/:userslug/edit`, accountMiddlewares, controllers.accounts.edit.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/edit/username`, accountMiddlewares, controllers.accounts.edit.username);
    helpers.setupPageRoute(app, `/${name}/:userslug/edit/email`, accountMiddlewares, controllers.accounts.edit.email);
    helpers.setupPageRoute(app, `/${name}/:userslug/edit/password`, accountMiddlewares, controllers.accounts.edit.password);
    app.use('/.well-known/change-password', (req: Request, res: Response) => {
        res.redirect('/me/edit/password');
    });
    helpers.setupPageRoute(app, `/${name}/:userslug/info`, accountMiddlewares, controllers.accounts.info.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/settings`, accountMiddlewares, controllers.accounts.settings.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/uploads`, accountMiddlewares, controllers.accounts.uploads.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/consent`, accountMiddlewares, controllers.accounts.consent.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/blocks`, accountMiddlewares, controllers.accounts.blocks.getBlocks);
    helpers.setupPageRoute(app, `/${name}/:userslug/sessions`, accountMiddlewares, controllers.accounts.sessions.get);
    helpers.setupPageRoute(app, '/notifications', [middleware.ensureLoggedIn], controllers.accounts.notifications.get);
    helpers.setupPageRoute(app, `/${name}/:userslug/chats/:roomid?`, middlewares, controllers.accounts.chats.get);
    helpers.setupPageRoute(app, '/chats/:roomid?', [middleware.ensureLoggedIn], controllers.accounts.chats.redirectToChat);
}


