// Adding filters of categories to filter work in the gallery
// Getting existing categories from api
document.addEventListener('DOMContentLoaded', function () {

fetch("http://localhost:5678/api/categories")
.then(function(response) {
	if(response.ok) {
		return response.json();
	}
})
.then(function(data) {
	let categories = data;
	categories.unshift({id: 0, name: 'Tous'});
	console.log(categories);
	// Looping on each category
	categories.forEach((category, index) => {
		// Creation <button> to filter
		let myButton = document.createElement('button');
		myButton.classList.add('work-filter');
		myButton.classList.add('filters-design');
		if(category.id === 0) myButton.classList.add('filter-active', 'filter-all');
		myButton.setAttribute('data-filter', category.id);
		myButton.textContent = category.name;
		// Adding the new <button> into the existing div.filters
		document.querySelector("div.filters").appendChild(myButton);
		// Click event <buttton> to filter
		myButton.addEventListener('click', function(event) {
			event.preventDefault();
			// Handling filters
			document.querySelectorAll('.work-filter').forEach((workFilter) => {
				workFilter.classList.remove('filter-active');
			});
			event.target.classList.add('filter-active');
			// Handling works
			let categoryId = myButton.getAttribute('data-filter');
			document.querySelectorAll('.work-item').forEach(workItem => {
				workItem.style.display = 'none';
			});
			document.querySelectorAll(`.work-item.category-id-${categoryId}`).forEach(workItem => {
				workItem.style.display = 'block';
			});
		});
	});
})
.catch(function(err) {
	console.log(err);
});
})