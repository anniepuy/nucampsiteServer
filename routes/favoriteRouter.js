const express = require('express');
const res = require('express/lib/response');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('User')
    .populate('Campsite')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite.includes(req.params.campsiteId)) {
            //or is it favorite.include(req.params.favorite._id)
            return ('This campsite is already a favorite')
        } else {
            Favorite.create(req.body.campsiteId)
            .then(favorite => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(response => {
        if (favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete');
        }   
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favortes');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    //need to add in if/else to see if it is already posted as a favorite
    Favorite.findOne(req.params.favoriteId, {
        $set: req.body
    }, {new: true})
    .then(favorites => {
        if (favorites.includes(req.params.campsiteId)) {
            res.statusCode = 403;
            res.end(`Favorites has been added /${req.params.campsiteId}`);
        } else {
            Favorite.create(req.body.campsiteId)
            .then(favorites => {
                console.log('Favorite Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
        }
     })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favortes');
})
/*
help
*/
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne(req.params.campsiteId)
    .then (favorite => {
        const indexOfFav = favorite.campsite.findIndex(favorite => {
            return favorite.id === req.params.campsiteId;
        })
        const favHold = favorite.campsiteId.filter(req.params.campsiteId);
        favorite.campsite.splice(favHold, 1)
    })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;

