/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // action - create
  create: async function (req, res) {
    if (req.method == "GET") return res.view("person/create");

    var person = await Person.create(req.body).fetch();

    return res.status(201).json({ id: person.id });
  },
  // action - jsjson function
  json: async function (req, res) {
    var everyones = await Person.find();

    return res.json(everyones);
  },
  // action - list
  list: async function (req, res) {
    var everyones = await Person.find();

    return res.view("person/list", { persons: everyones });
  },
  // action - read
  read: async function (req, res) {
    var thatPerson = await Person.findOne(req.params.id);

    if (!thatPerson) return res.notFound();

    return res.view("person/read", { person: thatPerson });
  },
  // action - delete
  delete: async function (req, res) {
    var deletedPerson = await Person.destroyOne(req.params.id);

    if (!deletedPerson) return res.notFound();

    //return res.ok("Person deleted.");
    //return res.redirect("/");
    if (req.wantsJSON) {
      return res.status(204).send(); // for ajax request
    } else {
      return res.redirect("/"); // for normal request
    }
  },
  // action - update
  update: async function (req, res) {
    if (req.method == "GET") {
      var thatPerson = await Person.findOne(req.params.id);

      if (!thatPerson) return res.notFound();

      return res.view("person/update", { person: thatPerson });
    } else {
      var updatedPerson = await Person.updateOne(req.params.id).set(req.body);

      if (!updatedPerson) return res.notFound();

      return res.ok("Record updated");
    }
  },
  // search function
  search: async function (req, res) {
    var whereClause = {};

    if (req.query.name) whereClause.name = { contains: req.query.name };

    var parsedAge = parseInt(req.query.age);
    if (!isNaN(parsedAge)) whereClause.age = parsedAge;

    var thosePersons = await Person.find({
      where: whereClause,
      sort: "name",
    });

    return res.view("person/list", { persons: thosePersons });
  },
  // action - paginate
  paginate: async function (req, res) {
    var limit = Math.max(req.query.limit, 2) || 2;
    var offset = Math.max(req.query.offset, 0) || 0;

    var somePersons = await Person.find({
      limit: limit,
      skip: offset,
    });

    var count = await Person.count();

    return res.view("person/paginate", {
      persons: somePersons,
      numOfRecords: count,
    });
  },
  populate: async function (req, res) {
    var person = await Person.findOne(req.params.id).populate("consultants");

    if (!person) return res.notFound();

    return res.json(person);
  },
  // action - aginate
  aginate: async function (req, res) {
    if (req.wantsJSON) {
      var perPage = Math.max(req.query.perPage, 2) || 2;
      var current = perPage * (Math.max(req.query.current - 1, 0) || 0);
      var somePersons = await Person.find({
        limit: perPage,
        skip: current,
      });

      return res.json(somePersons);
    } else {
      var count = await Person.count();

      return res.view("person/aginate", { total: count });
    }
  },
  // action - vaginate
vaginate: async function (req, res) {

  if (req.wantsJSON) {

    var perPage = Math.max(req.query.perPage, 2) || 2;

    var somePersons = await Person.find({
        limit: perPage,
        skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
    });

    return res.json(somePersons);

} else {

    var count = await Person.count();

    return res.view('person/vaginate', { total: count });
}
},
// action - baginate
baginate: async function (req, res) {

  if (req.wantsJSON) {

    var perPage = Math.max(req.query.perPage, 2) || 2;

    var somePersons = await Person.find({
        limit: perPage,
        skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
    });

    return res.json(somePersons);

} else {

    var count = await Person.count();

    return res.view('person/baginate', { total: count });
}
},
};
