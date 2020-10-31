const Pivotal = require('./pivotal.js');
const fs = require('fs');
const { parse } = require('json2csv');
const sprintLabel = 'sprint 116';

const pivotal = new Pivotal(process.env.PIVOTAL_TOKEN);


const buildReleasesCsv = async () => {
  const allStories = [];

  const projects = await pivotal.getProjects();

  for (let i = 0; i < projects.length; i++) {
    console.log(`\n----- ${i} -----\n`);
    const releasesSearchResults = await pivotal.getReleases(projects[i].id);
    const stories = releasesSearchResults.filter((story) => {
      for (const label of story.labels) {
        if (label.name === sprintLabel) {
          return true;
        }
      }
      return story.current_state !== 'accepted';
    });

    for (let j = 0; j < stories.length; j++) {
      console.log(`\n----- ${i} :: ${j} -----\n`);
      const story = await pivotal.getStory(stories[j].id, {
        fields: [ ':default', 'owners', 'project', 'requested_by' ],
      });

      story.project = story.project ? story.project.name : null;


      story.owners = story.owners ? story.owners.map((owner) => owner.name).join(', ') : '';

      story.requestor = story.requested_by ? story.requested_by.name : null;
      delete story.requested_by;

      story.labels = story.labels ? story.labels.map((label) => label.name).join(', ') : '';

      delete story.requested_by_id;
      delete story.owner_ids;
      delete story.owned_by_id;
      delete story.project_id;
      delete story.description;
      allStories.push(story);
    }
  }

  console.log(`Final Release Count: ${allStories.length}`);

  const csv = parse(allStories);

  fs.writeFile('releases.csv', csv, function(err) {
    if (err) {
      return console.log(err);
    }
  });
};

buildReleasesCsv();
