const Product = require('../models/Products')
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add a product',
    path: '/admin/add-product',
    editing: false,
    csrfToken: req.csrfToken()
  })
}

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req)
  console.log("ERRORS: ", errors)
  console.log("ERRORS: ", errors.isEmpty())

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin',
      editing: false,
      errorMessage: errors.array()[0].msg
    })
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.user
  })
  product.save().then(() => {
    res.redirect('/')
  }).catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  console.log("EDITMD GET: ", editMode)

  if (!editMode) {
    return res.redirect('/')
  }
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      })
    })
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  // const editMode = req.query.edit
  // console.log("EDITMD: ", editMode)
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updateDesc = req.body.description
  const updatedImageUrl = req.body.imageUrl

  const errors = validationResult(req)


  Product.findById(prodId).then(product => {
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin',
        editing: true,
        product: product,
        errorMessage: errors.array()[0].msg
      })
    }
    
    product.title = updatedTitle,
    product.price = updatedPrice,
    product.description = updateDesc,
    product.imageUrl = updatedImageUrl

    return product.save()
  })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByIdAndRemove(prodId).then(() => {
    console.log('DESTROYED PRODUCT')
    res.redirect('/')
  }).catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate('userId', 'name -_id')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};