Stage 2 Revisions and Comments

Comment 1: Why is Approvals an entity and not just a 1-1 relationship between Profile and Loan?
Revision 1: In our original submission approvals was listed as its own entity in the UML diagram. On its own Approvals had no purpose as an entity, so decided to change it be a relationship between a new entity users and loan. Overall, we changed approvals from an entity to a relationship between entities in the UML diagram. 

Comment 2: Why can't the attributes in Profile just be attributes in User, and the relationships it has with other tables be relationships between User and those tables? I'm not sure what you mean by an abstraction of common attributes. What conceptually does a Profile represent that allows it to exist independently of a User?
Revision 2: In our original submission we felt we could have a Profile entity in order to reduce redudnacy in other entities and that it would increase overall efficiency. However, we realized that profile is unneccesary because we could add all the attributes in Profile to User and then link User with those tables. To fix this we merged Profile with User and connected User with the appropriate entities.

Comment 3: What information will be stored in the Simulations table? Right now, there's just the ID, foreign key, and created date. How will this be useful to users?
Revision 3: We added an eval score to the Simulations table to give users a sense of how likely they are to match up with a bank if certain attributes were to be changed.

Comment 4: FKs shouldn't be included in the UML diagram. FKs are implementation level, not conceptual level.
Revision 4: We removed all FKs from the UML diagram.

Comment 5: No normalization process shown
