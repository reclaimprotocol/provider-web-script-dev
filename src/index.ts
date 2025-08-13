/// You can write your provider script code here.
/// No need to import any files.
/// To build a production release for publishing on devtools: `npm run build`
/// To build a release for development & testing with mock data: `npm run build:dev`. You can edit the mock data in `dev.ts` file to update any mock data and/or declare any custom types in `website.d.ts` file.

/// BTW you can import & use any npm browser compatible packages here. They will be bundled with the script.

const onReady = async () => {
  window.Reclaim.updatePublicData({
    data: [
      {
        userId: 1,
        id: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
      },
      {
        userId: 1,
        id: 2,
        title: "qui est esse",
        body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
      },
      {
        userId: 1,
        id: 3,
        title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
      },
    ],
  });
};

setTimeout(
  async () => {
    try {
      if ("Reclaim" in window) {
        await onReady();
      } else {
        throw new Error("Not running in the Reclaim Web Environment");
      }
    } catch (e) {
      console.error(e);
    }
  },
  // Ensure page elements are loaded
  1000
);
