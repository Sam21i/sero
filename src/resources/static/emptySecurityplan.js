export const EMPTY_SECURITY_PLAN =
  '{"resourceType":"CarePlan","status":"active","id":"sicherheitsplan","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"master"}]}],"contained":[{"resourceType":"CarePlan","id":"motivation","status":"active","intent":"plan","title":"Meine Motivation zu leben","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"motivation"}]}],"description":"Was gibt mir Kraft? Was hält mich am Leben? Was möchte ich noch erleben?","activity":[]},{"resourceType":"CarePlan","id":"warningSigns","status":"active","intent":"plan","title":"Meine Frühwarnzeichen","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"warningSigns"}]}],"description":"Welche Gedanken, Gefühle oder Verhaltensweisen treten bei mir vor einer suizidalen Krise auf?","activity":[]},{"resourceType":"CarePlan","id":"copingStrategies","status":"active","intent":"plan","title":"Meine Bewältigungsstrategien","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"copingStrategies"}]}],"description":"Was tue ich selbst, wenn Suizidgedanken stärker werden? Was hilft mir in solchen Augenblicken?","activity":[]},{"resourceType":"CarePlan","id":"distractionStrategies","status":"active","intent":"plan","title":"Meine Ablenkungsstrategien","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"distractionStrategies"}]}],"description":"Welche Aktivität tut mir gut? An welchen Orten und Plätzen oder mit welchen Menschen komme ich auf andere Gedanken?","activity":[]},{"resourceType":"CarePlan","id":"personalBeliefs","status":"active","intent":"plan","title":"Meine Glaubenssätze","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"personalBeliefs"}]}],"description":"Was sind meine Glaubenssätze?","activity":[]},{"resourceType":"CarePlan","id":"professionalContacts","status":"active","intent":"plan","title":"Meine professionellen Helfer- und Notfallnummern","category":[{"coding":[{"system":"http://midata.coop/sero/securityplan","code":"professionalContacts"}]}],"description":"Welche Fachpersonen oder Organisationen unterstützen mich im Notfall?","activity":[{"detail":{"status":"unknown","description":"Beratung LUPS (0900 85 65 65)"}},{"detail":{"status":"unknown","description":"Die Dargebotene Hand (143)"}},{"detail":{"status":"unknown","description":"Polizei (117)"}}]}],"intent":"plan","title":"Mein Sicherheitsplan","subject":{},"author":{},"basedOn":[{"reference":"#motivation","type":"CarePlan"},{"reference":"#warningSigns","type":"CarePlan"},{"reference":"#copingStrategies","type":"CarePlan"},{"reference":"#distractionStrategies","type":"CarePlan"},{"reference":"#personalBeliefs","type":"CarePlan"},{"reference":"#professionalContacts","type":"CarePlan"}]}';
