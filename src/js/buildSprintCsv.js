const Pivotal = require('./pivotal.js');
const fs = require('fs');
const { parse } = require('json2csv');
const sprintLabel = 'sprint 116';

const pivotal = new Pivotal(process.env.PIVOTAL_TOKEN);

const buildCsv = async () => {
  const allStories = [];

  const projects = await pivotal.getProjects();

  for (let i = 0; i < projects.length; i++) {
    console.log(`\n----- ${i} -----\n`);

    const searchResults = await pivotal.search(projects[i].id, `label:"${sprintLabel}"`);

    const stories = searchResults.stories.stories;

    for (let j = 0; j < stories.length; j++) {
      console.log(`\n----- ${i} :: ${j} -----\n`);
      const story = await pivotal.getStory(stories[j].id);

      const project = await pivotal.getProject(story.project_id);
      story.project = project.name;

      const owners = await pivotal.getStoryOwners(project.id, story.id);
      story.owners = owners.length ? owners.map((owner) => owner.name).join(', ') : '';

      const requestor = story.requested_by_id ? await pivotal.getPerson(story.requested_by_id) : null;
      story.requestor = requestor ? requestor.person.name : null;

      story.labels = story.labels ? story.labels.map((label) => label.name).join(', ') : '';

      delete story.requested_by_id;
      delete story.owner_ids;
      delete story.owned_by_id;
      delete story.project_id;
      delete story.description;

      allStories.push(story);
    }
  }

  console.log(`Final Story Count: ${allStories.length}`);

  const csv = parse(allStories);

  fs.writeFile('sprint-stories.csv', csv, function(err) {
    if (err) {
      return console.log(err);
    }
  });
};

buildCsv();
