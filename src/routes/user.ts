import express, { Application, Request, Response } from 'express';
import { Middleware } from './types';
import { setupPageRoute } from './helpers';

interface Controllers {
  accounts: {
    profile: {
      get: (req: Request, res: Response) => void;
    };
    follow: {
      getFollowing: (req: Request, res: Response) => void;
      getFollowers: (req: Request, res: Response) => void;
    };
    posts: {
      getPosts: (req: Request, res: Response) => void;
      getTopics: (req: Request, res: Response) => void;
      getBestPosts: (req: Request, res: Response) => void;
      getControversialPosts: (req: Request, res: Response) => void;
    };
    groups: {
      get: (req: Request, res: Response) => void;
    };
    categories: {
      get: (req: Request, res: Response) => void;
    };
    bookmarks: {
      getBookmarks: (req: Request, res: Response) => void;
    };
    watched: {
      getWatchedTopics: (req: Request, res: Response) => void;
    };
    ignored: {
      getIgnoredTopics: (req: Request, res: Response) => void;
    };
    upvoted: {
      getUpVotedPosts: (req: Request, res: Response) => void;
    };
    downvoted: {
      getDownVotedPosts: (req: Request, res: Response) => void;
    };
    edit: {
      get: (req: Request, res: Response) => void;
      username: (req: Request, res: Response) => void;
      email: (req: Request, res: Response) => void;
      password: (req: Request, res: Response) => void;
    };
    info: {
      get: (req: Request, res: Response) => void;
    };
    settings: {
      get: (req: Request, res: Response) => void;
    };
    uploads: {
      get: (req: Request, res: Response) => void;
    };
    consent: {
      get: (req: Request, res: Response) => void;
    };
    blocks: {
      getBlocks: (req: Request, res: Response) => void;
    };
    sessions: {
      get: (req: Request, res: Response) => void;
    };
    notifications: {
      get: (req: Request, res: Response) => void;
    };
    chats: {
      get: (req: Request, res: Response) => void;
      redirectToChat: (req: Request, res: Response) => void;
    };
  };
}

module.exports = function (
  app: Application,
  name: string,
  middleware: Middleware,
  controllers: Controllers
) {
  const middlewares: Middleware[] = [middleware.exposeUid, middleware.canViewUsers];
  const accountMiddlewares: Middleware[] = [
    middleware.exposeUid,
    middleware.ensureLoggedIn,
    middleware.canViewUsers,
    middleware.checkAccountPermissions,
  ];

  setupPageRoute(app, '/me', [], middleware.redirectMeToUserslug);
  setupPageRoute(app, '/me/*', [], middleware.redirectMeToUserslug);
  setupPageRoute(app, '/uid/:uid*', [], middleware.redirectUidToUserslug);

  setupPageRoute(app, `/${name}/:userslug`, middlewares, controllers.accounts.profile.get);
  setupPageRoute(app, `/${name}/:userslug/following`, middlewares, controllers.accounts.follow.getFollowing);
  setupPageRoute(app, `/${name}/:userslug/followers`, middlewares, controllers.accounts.follow.getFollowers);

  setupPageRoute(app, `/${name}/:userslug/posts`, middlewares, controllers.accounts.posts.getPosts);
  setupPageRoute(app, `/${name}/:userslug/topics`, middlewares, controllers.accounts.posts.getTopics);
  setupPageRoute(app, `/${name}/:userslug/best`, middlewares, controllers.accounts.posts.getBestPosts);
  setupPageRoute(app, `/${name}/:userslug/controversial`, middlewares, controllers.accounts.posts.getControversialPosts);
  setupPageRoute(app, `/${name}/:userslug/groups`, middlewares, controllers.accounts.groups.get);

  setupPageRoute(app, `/${name}/:userslug/categories`, accountMiddlewares, controllers.accounts.categories.get);
  setupPageRoute(app, `/${name}/:userslug/bookmarks`, accountMiddlewares, controllers.accounts.posts.getBookmarks);
  setupPageRoute(app, `/${name}/:userslug/watched`, accountMiddlewares, controllers.accounts.posts.getWatchedTopics);
  setupPageRoute(app, `/${name}/:userslug/ignored`, accountMiddlewares, controllers.accounts.posts.getIgnoredTopics);
  setupPageRoute(app, `/${name}/:userslug/upvoted`, accountMiddlewares, controllers.accounts.posts.getUpVotedPosts);
  setupPageRoute(app, `/${name}/:userslug/downvoted`, accountMiddlewares, controllers.accounts.posts.getDownVotedPosts);
  setupPageRoute(app, `/${name}/:userslug/edit`, accountMiddlewares, controllers.accounts.edit.get);
  setupPageRoute(app, `/${name}/:userslug/edit/username`, accountMiddlewares, controllers.accounts.edit.username);
  setupPageRoute(app, `/${name}/:userslug/edit/email`, accountMiddlewares, controllers.accounts.edit.email);
  setupPageRoute(app, `/${name}/:userslug/edit/password`, accountMiddlewares, controllers.accounts.edit.password);
  app.use('/.well-known/change-password', (req: Request, res: Response) => {
    res.redirect('/me/edit/password');
  });
  setupPageRoute(app, `/${name}/:userslug/info`, accountMiddlewares, controllers.accounts.info.get);
  setupPageRoute(app, `/${name}/:userslug/settings`, accountMiddlewares, controllers.accounts.settings.get);
  setupPageRoute(app, `/${name}/:userslug/uploads`, accountMiddlewares, controllers.accounts.uploads.get);
  setupPageRoute(app, `/${name}/:userslug/consent`, accountMiddlewares, controllers.accounts.consent.get);
  setupPageRoute(app, `/${name}/:userslug/blocks`, accountMiddlewares, controllers.accounts.blocks.getBlocks);
  setupPageRoute(app, `/${name}/:userslug/sessions`, accountMiddlewares, controllers.accounts.sessions.get);

  setupPageRoute(app, '/notifications', [middleware.ensureLoggedIn], controllers.accounts.notifications.get);
  setupPageRoute(app, `/${name}/:userslug/chats/:roomid?`, middlewares, controllers.accounts.chats.get);
  setupPageRoute(app, '/chats/:roomid?', [middleware.ensureLoggedIn], controllers.accounts.chats.redirectToChat);
};
