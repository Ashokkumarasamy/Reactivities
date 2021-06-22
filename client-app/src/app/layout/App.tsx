import React, { Fragment, useEffect, useState } from 'react';
import './styles.css';

import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import {v4 as uuid} from 'uuid'

function App() {

  const [activities,setActivities] = useState<Activity[]>([]);

  const [selectedActivity,setSelectedActivity] = useState<Activity| undefined>(undefined);

  const [editMode,setEditMode] = useState(false);
  
  const [loading,setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities : Activity[] = [];

    response.forEach((activity: Activity) => {

  activity.date = activity.date.split('T')[0];
  activities.push(activity);
    })
  setActivities(activities);
  setLoading(false);
  
  
});

  },[])

  function handleSelectedActivity(id : String)
  {
    setSelectedActivity(activities.find(x=>x.id ===id));
  }
  function handleCancelSelectActivity()
  {
    setSelectedActivity(undefined);
  }
  function handleFormOpen(id ?: string)
  {
    id ? handleSelectedActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }
  function handleFormClose()
  {
    setEditMode(false);
  }
  function handleCreateEditActivity(activity : Activity)
  {
   setSubmitting(true);
   if (activity.id) {
     agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(x => x.id !== activity.id),activity])
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
     })
   }
   else{
     activity.id = uuid();
     agent.Activities.create(activity).then(() => {
       setActivities([...activities,activity])
       setSelectedActivity(activity);
       setEditMode(false);
       setSubmitting(false);
     })
   }
  }
  function handleDeleteActivity(id : string)
  {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x=>x.id!==id)]);
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponent content = 'Loading app'/>


  return (
<>

<NavBar openForm = {handleFormOpen}/>
    <Container style = {{marginTop : '7em'}}>
      <ActivityDashboard
       activities = {activities}
selectedActivity = {selectedActivity}
selectActivity = {handleSelectedActivity}
cancelSelectActivity = {handleCancelSelectActivity}
editMode = {editMode}
openForm = {handleFormOpen}
closeForm = {handleFormClose}
createOrEdit = {handleCreateEditActivity}
deleteActivity = {handleDeleteActivity}
submitting = {submitting}
       
       
       />
        </Container>
</>
   
  );
}

export default App;

