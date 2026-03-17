# parkpro
<img width="250" height="250" alt="ParkPro @ UIC" src="https://github.com/user-attachments/assets/394d5cfe-8cbb-4c5d-a19a-8b441a86b004" />

ParkPro is a summer project I created in 2025 with the intenion of making parking easier for students at my university, especially first-years. It utilizes HTML/CSS/JS, Firebase, and Google Maps APIs. It allows users to input their class schedule and receive recommended lots based on the proximity of the parking lots to their overall schedule. I utilized Google Maps APIs specifically to calculate this proximity data. I care a lot about commuting, and I hope that is shown through this project!

ParkPro can be accessed at parkproatuic.com, but you need a pin and certain email that only I have as the creator. As such, I am editing this README file to help viewers such as yourself understand and see what happens on the site without being able to access it.

### Most Important Pages

#### 'Home' Page
The homepage features many things, and is meant to serve as an inviting introduction or familiar landing page to new and returning users. It starts off with a background image of the expressway and a few phrases about ParkPro's main helpful features. There is also an option to submit feedback to the creator towards the end of the page. Lastly, you will see a bottom nav bar which can be found on each and every page of the site. I'll let the imagery speak for itself.

##### Imagery
(sorry, images might be a bit stretched as I am limiting the size of all images to 250x250px).

<img width="250" height="250" alt="homepage" src="https://github.com/user-attachments/assets/6d557235-a89c-4896-8a64-8542ab5a46b9" />
<img width="250" height="250" alt="homepage-2" src="https://github.com/user-attachments/assets/0a780565-9856-41d9-9de5-261000bf3890" />
<img width="250" height="250" alt="homepage-3" src="https://github.com/user-attachments/assets/ad13f7da-82d7-4dce-8533-fc85f73cf783" />
<img width="250" height="250" alt="homepage-4" src="https://github.com/user-attachments/assets/5a50d584-0895-4e90-9c3e-77e6283b56aa" />
<img width="250" height="250" alt="bottom-bar" src="https://github.com/user-attachments/assets/bf8a9d15-cf43-4721-b521-8b9c361cf0a0" />



#### 'Find A Lot' Page
##### This is where the magic happens!

The Find a Lot page starts out by allowing the user two options to choose from. Each options slightly differs in terms of its primary goal. One allows students take take hold of the reigns a bit more by ranking their classes, so that some classes wil have more priority when calculating the best parking lots for their schedule (this is where Google Maps API is used). The other gives the algorithm more control and simply determines how many times each lot is listed as the 'closest' to each of their classes. In the imagery below, I chose the student-defined option, and I ranked three example classes. As shown, the priority was meant to go towards cs 277 and it has the highest priority of 3, while cs 111 lecture and lab only have a priority of 1, the lowest. Normally, the algorithm would probably me more likely to recommend the Halsted Street Parking Structure to me, since it is closest to cs 111 buildings, but since I gave priority to cs 277, we can see that Lot 14 and Lot 6 and top 2 in the ranking. These cards give short, yet beneficial information about the recommended lots, such as accessibility, electric vehicle charging, total # of parking spots (not available for all lots), etc. There is also a Link to Parking Application button that would take the student directly to UIC's parking application website. *Note: This does not necessarily guarantee that a student can receive the parking pass for the lot, especially if all parking passes for this particular lot are sold out. That is why the excluded lots option is also available, to allow students to exclude lots for that or other reasons.*

The excluded lots will simply not be considered during the calculations. In the image, the excluded lots button was not clicked, hence why the lots chosen were not yet listed in the excluded lots list, but trust me it works!

##### Imagery

<img width="250" height="250" alt="find-a-lot-options" src="https://github.com/user-attachments/assets/2d77769e-64e3-4ffb-ad52-241dae090330" />

<img width="250" height="250" alt="find-a-lot-exinput" src="https://github.com/user-attachments/assets/4dfab440-1c5e-4fe0-83b3-07d1fb343c87" />

<img width="250" height="250" alt="find-a-lot-exoutput" src="https://github.com/user-attachments/assets/bbc0ad10-b657-4900-8547-f6bf8d4b5229" />



#### 'Tips From Others' Page

This is another important page, as it allows students to submit tips about parking, parkpro, or anything else related to parking (all of the categories can be found in the imagery below. We also can see two tips submitted from Levell (wait...that's me!).

##### Imagery
<img width="250" height="250" alt="tips-dropdowns" src="https://github.com/user-attachments/assets/2f91f759-d73a-430d-bc08-bca402a9d2a1" />
<img width="250" height="250" alt="tips-from-levell" src="https://github.com/user-attachments/assets/7114b0de-0a84-4e37-9dab-2a53dc01bb45" />


#### Misc. Pages

Miscellaneous pages include the 'Resources', 'Contact', 'Profile', and 'FAQ' pages. These pages are beneficial but do not necessarily play a major role towards the goal of the site. However, the profile page was one that I wanted to do more with, as in, more profile-specific features in the future.

##### Imagery
<img width="250" height="250" alt="signup-page" src="https://github.com/user-attachments/assets/a2046cd2-061b-4027-bb94-a53f3976bd9a" />
<img width="250" height="250" alt="contact-page" src="https://github.com/user-attachments/assets/5a21c868-61bc-41f7-a95b-e9d213d573c2" />
<img width="250" height="250" alt="resources-page" src="https://github.com/user-attachments/assets/7e75ebb5-8ad6-49cc-9bc2-2d4f4b90dc20" />
<img width="250" height="250" alt="faq-page" src="https://github.com/user-attachments/assets/5963ee9a-f7dd-45b1-82e8-719dda5872fd" />




##### About the Future of ParkPro
While I have not touched ParkPro since the Summer 2025 season, I do want to continue work on it again, if I can find time this summer (2026). I want to learn React.js so that I can make the site look even cooler, and I want to actually implement some of the features that are not currently working, especially profile features. As much as I want to also launch this with UIC, I am not entirely sure how fruitful it might be, but I do not think this is the end for ParkPro. More importantly, ParkPro is just one way that I like to show how much commuting and parking/driving means to me.
