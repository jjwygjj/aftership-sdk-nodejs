var Aftership = require("../dist/index.js").AfterShip;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var chai = require("chai");

var expect = chai.expect;
var aftership = new Aftership("SOME_API_KEY");

describe("LastCheckPoint", function () {
  describe("#getLastCheckPoint(), validate params", function () {
    it("should throw exception when not specify tracking id and tracking number", async function () {
      let expected_error =
        "HandlerError: You must specify the tracking number or tracking id";
      try {
        await aftership.last_checkpoint.getLastCheckPoint();
      } catch (e) {
        expect(e.message).to.equal(expected_error);
      }
    });

    it("should throw exception when both specify tracking id and tracking number", async function () {
      let expected_error =
        "HandlerError: Cannot specify tracking number and tracking id at the same time";
      const param = {
        tracking_id: "5b74f4958776db0e00b6f5ed",
        slug: "ups",
        tracking_number: "1234567890",
      };
      try {
        await aftership.last_checkpoint.getLastCheckPoint(param);
      } catch (e) {
        expect(e.message).to.equal(expected_error);
      }
    });

    it("should throw exception when only specify slug", async function () {
      let expected_error =
        "HandlerError: You must specify the tracking number or tracking id";
      const param = {
        slug: "ups",
      };
      try {
        await aftership.last_checkpoint.getLastCheckPoint(param);
      } catch (e) {
        expect(e.message).to.equal(expected_error);
      }
    });

    it("should throw exception when only specify tracking number", async function () {
      let expected_error =
        "HandlerError: You must specify the tracking number or tracking id";
      const param = {
        tracking_number: "1234567890",
      };
      try {
        await aftership.last_checkpoint.getLastCheckPoint(param);
      } catch (e) {
        expect(e.message).to.equal(expected_error);
      }
    });
  });

  describe("#getLastCheckPoint({slug, tracking_number})", function () {
    it("should get last checkpoint when success", function (done) {
      const param = {
        slug: "ups",
        tracking_number: "1234567890",
      };

      // This sets the mock adapter on the default instance
      var mock = new MockAdapter(axios);
      mock
        .onGet(`/last_checkpoint/${param.slug}/${param.tracking_number}`)
        .reply(
          200,
          {
            meta: {
              code: 200,
            },
            data: {
              id: "5b74f4958776db0e00b6f5ed",
              tracking_number: "111111111111",
              slug: "fedex",
              tag: "Delivered",
              subtag: "Delivered_001",
              subtag_message: "Delivered",
              checkpoint: {
                slug: "fedex",
                created_at: "2018-08-16T03:50:47+00:00",
                checkpoint_time: "2018-08-01T13:19:47-04:00",
                city: "Deal",
                coordinates: [],
                country_iso3: null,
                country_name: null,
                message:
                  "Delivered - Left at front door. Signature Service not requested.",
                state: "NJ",
                tag: "Delivered",
                subtag: "Delivered_001",
                subtag_message: "Delivered",
                zip: null,
                raw_tag: "FPX_L_RPIF",
              },
            },
          },
          {
            "x-ratelimit-reset": 1406096275,
            "x-ratelimit-limit": 10,
            "x-ratelimit-remaining": 9,
          }
        );

      aftership.last_checkpoint
        .getLastCheckPoint(param)
        .then((result) => {
          if (
            result &&
            result.data &&
            result.data.checkpoint &&
            result.data.checkpoint.slug === "fedex"
          ) {
            done();
          } else {
            done("not found last checkpoint");
          }
        })
        .catch((e) => done(e.message));
    });

    it("should get error meta when no success", function (done) {
      const param = {
        slug: "ups",
        tracking_number: "1234567890",
      };

      // This sets the mock adapter on the default instance
      var mock = new MockAdapter(axios);
      mock
        .onGet(`/last_checkpoint/${param.slug}/${param.tracking_number}`)
        .reply(
          404,
          {
            meta: {
              code: 4004,
              type: "BadRequest",
              message: "Tracking does not exist.",
            },
            data: {},
          },
          {
            "x-ratelimit-reset": 1406096275,
            "x-ratelimit-limit": 10,
            "x-ratelimit-remaining": 9,
          }
        );

      aftership.last_checkpoint
        .getLastCheckPoint(param)
        .then(_ => {
          done("not catch the exception");
        })
        .catch(e => {
          if (e.type === "BadRequest") {
            done();
          } else {
            done("not parse the error type correctly");
          }
        });
    });
  });

  describe("#getLastCheckPoint({tracking_id})", function () {
    it("should get last checkpoint when success", function (done) {
      const param = {
        tracking_id: "5b74f4958776db0e00b6f5ed",
      };

      // This sets the mock adapter on the default instance
      var mock = new MockAdapter(axios);
      mock.onGet(`/last_checkpoint/${param.tracking_id}`).reply(
        200,
        {
          meta: {
            code: 200,
          },
          data: {
            id: "5b74f4958776db0e00b6f5ed",
            tracking_number: "111111111111",
            slug: "fedex",
            tag: "Delivered",
            subtag: "Delivered_001",
            subtag_message: "Delivered",
            checkpoint: {
              slug: "fedex",
              created_at: "2018-08-16T03:50:47+00:00",
              checkpoint_time: "2018-08-01T13:19:47-04:00",
              city: "Deal",
              coordinates: [],
              country_iso3: null,
              country_name: null,
              message:
                "Delivered - Left at front door. Signature Service not requested.",
              state: "NJ",
              tag: "Delivered",
              subtag: "Delivered_001",
              subtag_message: "Delivered",
              zip: null,
              raw_tag: "FPX_L_RPIF",
            },
          },
        },
        {
          "x-ratelimit-reset": 1406096275,
          "x-ratelimit-limit": 10,
          "x-ratelimit-remaining": 9,
        }
      );

      aftership.last_checkpoint
        .getLastCheckPoint(param)
        .then((result) => {
          if (
            result &&
            result.data &&
            result.data.checkpoint &&
            result.data.checkpoint.slug === "fedex"
          ) {
            done();
          } else {
            done("not found last checkpoint");
          }
        })
        .catch((e) => done(e.message));
    });

    it("should catch exception when error", function (done) {
      const param = {
        tracking_id: "5b74f4958776db0e00b6f5ed",
      };

      // This sets the mock adapter on the default instance
      var mock = new MockAdapter(axios);
      mock.onGet(`/last_checkpoint/${param.tracking_id}`).reply(
        404,
        {
          meta: {
            code: 4004,
            type: "BadRequest",
            message: "Tracking does not exist.",
          },
          data: {},
        },
        {
          "x-ratelimit-reset": 1406096275,
          "x-ratelimit-limit": 10,
          "x-ratelimit-remaining": 9,
        }
      );

      aftership.last_checkpoint
        .getLastCheckPoint(param)
        .then(_ => {
          done("not catch the exception");
        })
        .catch(e => {
          if (e.type === "BadRequest") {
            done();
          } else {
            done("not parse the error type correctly");
          }
        });
    });
  });
});
