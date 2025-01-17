const apiUrl = 'https://gfbackend-1o5e.onrender.com'; // Updated URL

function queryProducts() {
    fetch(`${apiUrl}/queryProducts`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#productsTable tbody');
            tableBody.innerHTML = '';
            data.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id_product}</td>
                    <td>${product.product_name}</td>
                    <td>${product.brand}</td>
                    <td>${product.height}</td>
                    <td>${product.width}</td>
                    <td>${product.depth}</td>
                    <td>${product.weight}</td>
                    <td>${product.package_type}</td>
                    <td>${product.price}</td>
                `;
                const actionButtons = createActionButtons(product.id_product);
                const actionCell = document.createElement('td');
                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error querying products:', error));
}

function showUploadForm() {
    document.getElementById('uploadForm').style.display = 'block';
}

function hideUploadForm() {
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('file-input').value = ''; // Clear file input
}

function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch(`${apiUrl}/uploadToStage`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            hideUploadForm(); // Close the upload form
            queryProducts(); // Refresh product list
        })
        .catch(error => console.error('Error uploading file:', error));
    } else {
        console.error('No file selected');
    }
}

function executeTask() {
    fetch(`${apiUrl}/executeTask`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        queryProducts(); // Refresh product list
    })
    .catch(error => console.error('Error executing task:', error));
}

function clearProductStages() {
    fetch(`${apiUrl}/clearProductStages`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        queryProducts(); // Refresh product list
    })
    .catch(error => console.error('Error clearing product stages:', error));
}

function truncateProductTable() {
    fetch(`${apiUrl}/truncateProductTable`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        queryProducts(); // Refresh product list
    })
    .catch(error => console.error('Error truncating product table:', error));
}

function showAddProductForm() {
    document.getElementById('addProductModal').style.display = 'block';
}

function hideAddProductForm() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset(); // Clear form fields when hiding the modal
}

function showEditProductForm(product) {
    document.getElementById('edit_id_product').value = product.id_product;
    document.getElementById('edit_product_name').value = product.product_name;
    document.getElementById('edit_brand').value = product.brand;
    document.getElementById('edit_height').value = product.height;
    document.getElementById('edit_width').value = product.width;
    document.getElementById('edit_depth').value = product.depth;
    document.getElementById('edit_weight').value = product.weight;
    document.getElementById('edit_package_type').value = product.package_type;
    document.getElementById('edit_price').value = product.price;

    document.getElementById('editProductModal').style.display = 'block';
}

function hideEditProductForm() {
    document.getElementById('editProductModal').style.display = 'none';
    document.getElementById('editProductForm').reset(); // Clear form fields when hiding the modal
}

function editProduct(event) {
    event.preventDefault();

    const id_product = document.getElementById('edit_id_product').value;
    const product_name = document.getElementById('edit_product_name').value;
    const brand = document.getElementById('edit_brand').value;
    const height = parseFloat(document.getElementById('edit_height').value);
    const width = parseFloat(document.getElementById('edit_width').value);
    const depth = parseFloat(document.getElementById('edit_depth').value);
    const weight = parseFloat(document.getElementById('edit_weight').value);
    const package_type = document.getElementById('edit_package_type').value;
    const price = parseFloat(document.getElementById('edit_price').value);

    fetch(`${apiUrl}/updateProduct`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_product, product_name, brand, height, width, depth, weight, package_type, price }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        hideEditProductForm();
        queryProducts(); // Refresh product list
    })
    .catch(error => console.error('Error editing product:', error));
}

function createActionButtons(productId) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => {
        // Fetch product details and then show edit form
        fetch(`${apiUrl}/getProduct?id_product=${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(product => showEditProductForm(product))
            .catch(error => console.error('Error fetching product details:', error));
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteProduct(productId);

    const actionContainer = document.createElement('div');
    actionContainer.className = 'action-buttons';
    actionContainer.appendChild(editButton);
    actionContainer.appendChild(deleteButton);

    return actionContainer;
}

function deleteProduct(productId) {
    fetch(`${apiUrl}/deleteProduct`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_product: productId }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        queryProducts(); // Refresh product list
    })
    .catch(error => console.error('Error deleting product:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addProductForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id_product = document.getElementById('id_product').value;
        const product_name = document.getElementById('product_name').value;
        const brand = document.getElementById('brand').value;
        const height = parseFloat(document.getElementById('height').value);
        const width = parseFloat(document.getElementById('width').value);
        const depth = parseFloat(document.getElementById('depth').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const package_type = document.getElementById('package_type').value;
        const price = parseFloat(document.getElementById('price').value);

        fetch(`${apiUrl}/addProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_product, product_name, brand, height, width, depth, weight, package_type, price }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            hideAddProductForm();
            queryProducts(); // Refresh product list
        })
        .catch(error => console.error('Error adding product:', error));
    });

    // Event listener for cancel button in add product form
    document.getElementById('addProductModal').addEventListener('click', function(event) {
        if (event.target.classList.contains('cancel-btn')) {
            hideAddProductForm();
        }
    });

    // Event listener for show upload form button
    document.getElementById('showUploadFormBtn')?.addEventListener('click', function() {
        showUploadForm();
    });

    // Event listener for close upload form button
    document.getElementById('closeUploadFormBtn')?.addEventListener('click', function() {
        hideUploadForm();
    });

    // Event listener for show add product form button
    document.getElementById('showAddProductFormBtn')?.addEventListener('click', function() {
        showAddProductForm();
    });

    // Event listener for close add product form button
    document.getElementById('closeAddProductFormBtn')?.addEventListener('click', function() {
        hideAddProductForm();
    });
});
