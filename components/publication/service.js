const model = require("./model");

class PublicationService {
  async list(id, page = 1, limit = 1) {
    const options = {
      sort: { createdAt: -1 },
      populate: {
        path: "user",
        select: "-password -__v -role -email",
      },
      page,
      limit,
    };
    const publications = await model.paginate({ user: id }, options);
    return {
      page: publications.page,
      itemsPerPage: publications.limit,
      totalPage: publications.totalPages,
      totalPublications: publications.totalDocs,
      publications: publications.docs,
    };
  }
  async create(body, userId) {
    const publication = await model({ ...body, user: userId });
    publication.save();
    return publication;
  }

  async findById(id) {
    const search = await model.findById(id);
    if (search == null) {
      return { response: "Publication not found" };
    } else {
      return search;
    }
  }
  async feed(page = 1, limit = 1, following) {
    const options = {
      page,
      limit,
      populate: {
        path: "user",
        select: "-password -__v -role -email",
      },
      sort: { createdAt: -1 },
    };
    const myFeed = await model.paginate({ user: { $in: following } }, options);
    return {
      following,
      Publication: myFeed.docs,
      page: myFeed.page,
      itemsPerPage: myFeed.limit,
      totalPublications: myFeed.totalDocs,
      totalPage: myFeed.totalPages,
    };
  }
  async update(id, body) {
    const publicationUpdate = await model.findByIdAndUpdate(id, body);
    return publicationUpdate;
  }

  async delete(id) {
    await model.findByIdAndDelete(id);
    return { response: true };
  }
}

module.exports = PublicationService;
