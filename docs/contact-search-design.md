# Contact Search Feature - Design Document

## Overview

This document describes the design for a modern contact search interface for the noas-reach CiviCRM extension. The feature provides full-text search across contacts with sortable, tabular results.

---

## 1. User Requirements

### Functional Requirements
- [ ] Text input field for full-text query
- [ ] Loading indicator during API request
- [ ] Display results in a responsive table
- [ ] One column per contact property
- [ ] Column headers for all properties
- [ ] Click header to sort (asc/desc toggle)

### Non-Functional Requirements
- Modern, clean UI consistent with CiviCRM
- Fast response times (< 500ms for typical queries)
- Accessible (keyboard navigable, screen reader friendly)
- Mobile responsive

---

## 2. Mockups

### 2.1 Search Screen - Empty State

<div style="border: 2px solid #ccc; border-radius: 8px; padding: 20px; max-width: 600px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Contact Search</div>
  <div style="position: relative;">
    <input type="search" placeholder="Search Contacts..." style="width: 100%; padding: 12px 40px 12px 40px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
    <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;">🔍</span>
    <button style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Search</button>
  </div>
  <div style="margin-top: 20px; text-align: center; color: #666;">No results yet. Enter a search term above.</div>
</div>

### 2.2 Search Screen - Loading State

<div style="border: 2px solid #ccc; border-radius: 8px; padding: 20px; max-width: 600px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Contact Search</div>
  <div style="position: relative;">
    <input type="search" value="My Search Query" style="width: 100%; padding: 12px 40px 12px 60px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
    <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;">🔍</span>
    <button style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Search</button>
    <div style="position: absolute; right: 100px; top: 10px; width: 20px; height: 20px; border: 3px solid rgba(200,200,200,.3); border-top-color: #4a90e2; border-radius: 50%; animation: spin 1s ease-in-out infinite;"></div>
  </div>
  <div style="margin-top: 20px; text-align: center; color: #666;">
    <span class="blink">Loading results...</span>
  </div>
  <style>
  @keyframes spin { from {transform: rotate(0deg); } to { transform: rotate(360deg); } } 
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } } 
  .blink { animation: blink 1s infinite; }</style>
</div>

### 2.3 Search Screen - Results State

<div style="border: 2px solid #ccc; border-radius: 8px; padding: 20px; max-width: 800px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <div style="font-size: 18px; font-weight: 600;">Contact Search</div>
    <button style="background: #f0f0f0; border: 1px solid #ccc; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Export</button>
  </div>
  <div style="position: relative; margin-bottom: 15px;">
    <input type="search" value="John Smith" style="width: 100%; padding: 12px 40px 12px 40px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
    <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;">🔍</span>
    <button style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Search</button>
  </div>
  <div style="color: #666; margin-bottom: 15px;">Showing 5 of 42 results for "John Smith"</div>
  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; cursor: pointer; user-select: none; border-bottom: 2px solid #ddd;">ID <span style="font-size: 0.8em; opacity: 0.3;">^v</span></th>
          <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; cursor: pointer; user-select: none; border-bottom: 2px solid #ddd;">Display Name <span style="font-size: 0.8em; opacity: 0.3;">^v</span></th>
          <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; cursor: pointer; user-select: none; border-bottom: 2px solid #ddd;">Email <span style="font-size: 0.8em; opacity: 0.3;">^v</span></th>
          <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; cursor: pointer; user-select: none; border-bottom: 2px solid #ddd;">Phone <span style="font-size: 0.8em; opacity: 0.3;">^v</span></th>
          <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; cursor: pointer; user-select: none; border-bottom: 2px solid #ddd;">City <span style="font-size: 0.8em; opacity: 0.3;">^v</span></th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-top: 1px solid #eee;"><td style="padding: 12px 15px;">12345</td><td style="padding: 12px 15px;">John Smith</td><td style="padding: 12px 15px;">john@email.com</td><td style="padding: 12px 15px;">+1 555-1234</td><td style="padding: 12px 15px;">Boston</td></tr>
        <tr style="border-top: 1px solid #eee;"><td style="padding: 12px 15px;">12346</td><td style="padding: 12px 15px;">John S.</td><td style="padding: 12px 15px;">js@x.org</td><td style="padding: 12px 15px;">+1 555-5678</td><td style="padding: 12px 15px;">New York</td></tr>
        <tr style="border-top: 1px solid #eee;"><td style="padding: 12px 15px;">12347</td><td style="padding: 12px 15px;">Johnny Smith</td><td style="padding: 12px 15px;"></td><td style="padding: 12px 15px;"></td><td style="padding: 12px 15px;">Chicago</td></tr>
        <tr style="border-top: 1px solid #eee;"><td style="padding: 12px 15px;">12348</td><td style="padding: 12px 15px;">J. Smith</td><td style="padding: 12px 15px;">jsmith@y.net</td><td style="padding: 12px 15px;">+1 555-9012</td><td style="padding: 12px 15px;">Austin</td></tr>
        <tr style="border-top: 1px solid #eee;"><td style="padding: 12px 15px;">12349</td><td style="padding: 12px 15px;">Smith, John</td><td style="padding: 12px 15px;"></td><td style="padding: 12px 15px;">+1 555-3456</td><td style="padding: 12px 15px;">Denver</td></tr>
      </tbody>
    </table>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
    <button style="padding: 8px 16px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;" disabled>← Previous</button>
    <span style="color: #666;">Page 1 of 9</span>
    <button style="padding: 8px 16px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">Next →</button>
  </div>
</div>

### 2.4 Mobile View

<div style="border: 2px solid #ccc; border-radius: 8px; padding: 15px; max-width: 300px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Contact Search</div>
  <div style="position: relative; margin-bottom: 15px;">
    <input type="search" placeholder="Search..." style="width: 100%; padding: 12px 40px 12px 40px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
    <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;">🔍</span>
    <button style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Go</button>
  </div>
  <div style="color: #666; margin-bottom: 15px;">Results (42)</div>
  <div style="border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px;">
    <div style="font-weight: 600; margin-bottom: 5px;">John Smith <span style="float: right; font-size: 0.9em;">v</span></div>
    <div style="font-size: 0.9em; color: #555;">ID: 12345</div>
    <div style="font-size: 0.9em; color: #555;">Email: john@email.com</div>
    <div style="font-size: 0.9em; color: #555;">Phone: +1 555-1234</div>
    <div style="font-size: 0.9em; color: #555;">City: Boston</div>
  </div>
  <div style="border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px;">
    <div style="font-weight: 600; margin-bottom: 5px;">John S. <span style="float: right; font-size: 0.9em;">v</span></div>
    <div style="font-size: 0.9em; color: #555;">ID: 12346</div>
    <div style="font-size: 0.9em; color: #555;">Email: js@x.org</div>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 15px;">
    <button style="padding: 6px 12px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;" disabled>←</button>
    <span style="color: #666; font-size: 0.9em;">1 2 3 ... 9</span>
    <button style="padding: 6px 12px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">→</button>
  </div>
</div>

## 3. Technical Architecture

### 3.1 Component Diagram

<div style="text-align: center; margin: 20px 0;">
  <div style="border: 2px solid #ccc; border-radius: 8px; padding: 30px; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <div style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Browser (UI Layer)</div>
    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
      <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; min-width: 150px;">ContactSearch<br><small>Component</small></div>
      <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; min-width: 150px;">ResultsTable<br><small>Component</small></div>
      <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; min-width: 150px;">Loading<br><small>Indicator</small></div>
    </div>
    <div style="display: flex; justify-content: center;">
      <div style="width: 30px; height: 2px; background: #ccc; margin: 0 5px;"></div>
      <div style="width: 30px; height: 2px; background: #ccc; margin: 0 5px;"></div>
      <div style="width: 30px; height: 2px; background: #ccc; margin: 0 5px;"></div>
    </div>
    <div style="text-align: center; margin: 10px 0;">↓</div>
    <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; display: inline-block; text-align: center; min-width: 150px;">API Client<br><small>(JavaScript)</small></div>
    <div style="text-align: center; margin: 20px 0;">↓</div>
    <div style="border: 2px solid #ccc; border-radius: 8px; padding: 30px; display: inline-block; margin-top: 20px;">
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">CiviCRM / PHP Layer</div>
      <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
        <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; min-width: 150px;">REST Endpoint<br><small>(civicrm/ajax)</small></div>
        <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; min-width: 150px;">Search Handler<br><small>(CRM_NoasReach)</small></div>
      </div>
      <div style="display: flex; justify-content: center;">
        <div style="width: 30px; height: 2px; background: #ccc; margin: 0 5px;"></div>
        <div style="width: 30px; height: 2px; background: #ccc; margin: 0 5px;"></div>
      </div>
      <div style="text-align: center; margin: 10px 0;">↓</div>
      <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; display: inline-block; text-align: center; min-width: 150px;">CiviCRM API<br><small>(Contact BAO)</small></div>
    </div>
  </div>
</div>

### 3.2 Data Flow

<div style="text-align: center; margin: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
    <div style="border: 2px solid #ccc; border-radius: 8px; padding: 10px 20px;">User Input</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[UI] ContactSearch Component<br><small>(onInput debounce 300ms)</small></div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[UI] Set loading state = true</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[JS] API Client POST /civicrm/ajax/noas_reach/contact_search</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[PHP] CRM_NoasReach_Page_AJAX::contactSearch()</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[PHP] CiviCRM API Contact.get (full_text = query)</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[PHP] Sanitize and format response</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[JS] API Client receives response</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[UI] Set loading state = false</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[UI] ResultsTable Component renders results</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">User sees table</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #ccc; border-radius: 8px; padding: 10px 20px; background: #f9f9f9;">(User clicks column header)</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[UI] ResultsTable onHeaderClick(column, direction)</div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #4a90e2; border-radius: 8px; padding: 10px 20px; background: #f0f8ff;">[JS] API Client POST /civicrm/ajax/noas_reach/contact_search<br><small>(with sort_by, sort_direction params)</small></div>
    <div style="font-size: 24px;">↓</div>
    <div style="border: 2px solid #ccc; border-radius: 8px; padding: 10px 20px;">... (repeat from step 4)</div>
  </div>
</div>

### 4. File Structure

```
ext/noas-reach/
+-- CRM/
|   +-- NoasReach/
|       +-- Page/
|       |   +-- AJAX.php          # AJAX endpoint handlers
|       +-- Search/
|           +-- ContactSearch.php # Main search logic
|           +-- Formatter.php     # Result formatting
+-- js/
|   +-- contact-search.js        # Main JavaScript module
|   +-- results-table.js         # Table component
+-- css/
|   +-- contact-search.css       # Styles
+-- templates/
|   +-- CRM/
|       +-- NoasReach/
|           +-- Page/
|               +-- ContactSearch.tpl  # Smarty template
+-- info.xml                      # Add menu item here
```

## 5. Technical Specifications

### 5.1 Backend (PHP / CiviCRM)

#### Endpoint
- **URL**: `/civicrm/ajax/noas_reach/contact_search`
- **Method**: POST
- **Format**: JSON

#### Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `q` | string | Yes | Full-text search query | `"John Smith"` |
| `sort_by` | string | No | Field to sort by | `"display_name"` |
| `sort_direction` | string | No | Sort direction | `"asc"` or `"desc"` |
| `page` | integer | No | Page number (1-based) | `1` |
| `limit` | integer | No | Results per page | `50` |

#### Response Format

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "contact_id": 12345,
        "display_name": "John Smith",
        "email": "john@example.com",
        "phone": "+1 555-1234",
        "city": "Boston",
        "state": "MA",
        "country": "United States",
        "contact_type": "Individual",
        "image_url": "https://.../photo.jpg"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "total_pages": 5
    }
  },
  "fields": [
    {"key": "contact_id", "label": "ID", "sortable": true},
    {"key": "display_name", "label": "Name", "sortable": true},
    {"key": "email", "label": "Email", "sortable": true},
    {"key": "phone", "label": "Phone", "sortable": true},
    {"key": "city", "label": "City", "sortable": true}
  ]
}
```

#### CiviCRM API Query

```php
// In CRM_NoasReach_Search_ContactSearch::search()
$params = [
    'sequential' => 1,
    'full_text' => $query,
    'return' => ['contact_id', 'display_name', 'email', 'phone', 'city'],
    'options' => ['sort' => "$sort_by $sort_direction", 'limit' => $limit, 'offset' => $offset],
];

$result = civicrm_api3('Contact', 'get', $params);
```

### 5.2 Frontend (JavaScript)

#### State Management

```javascript
{
  query: '',           // Current search input
  isLoading: false,    // Loading state
  results: [],         // Array of contact objects
  pagination: {},      // Pagination info
  fields: [],          // Available fields for display
  sortBy: null,        // Current sort field
  sortDirection: 'asc' // Current sort direction
}
```

#### Component: ContactSearch

```javascript
class ContactSearch {
  constructor(containerId, options) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.state = { ... };
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  render() {
    // Render search input and container
  }
  
  bindEvents() {
    // Debounced input handler
    // Form submit handler
  }
  
  async search(query, page = 1) {
    this.setState({ isLoading: true });
    
    const response = await api.post('/civicrm/ajax/noas_reach/contact_search', {
      q: query,
      sort_by: this.state.sortBy,
      sort_direction: this.state.sortDirection,
      page: page,
      limit: 10
    });
    
    this.setState({
      isLoading: false,
      results: response.data.results,
      pagination: response.data.pagination,
      fields: response.data.fields
    });
    
    this.renderResults();
  }
}
```

#### Component: ResultsTable

```javascript
class ResultsTable {
  constructor(data, options) {
    this.data = data;
    this.options = options;
  }
  
  render() {
    // Render table with headers, rows, pagination
  }
  
  onHeaderClick(fieldKey) {
    let direction = 'asc';
    
    if (this.options.sortBy === fieldKey) {
      direction = this.options.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    this.options.onSort(fieldKey, direction);
    this.render();
  }
  
  getSortIndicator(fieldKey) {
    if (this.options.sortBy !== fieldKey) return null;
    return this.options.sortDirection === 'asc' ? '^' : 'v';
  }
}
```

### 5.3 Styling (CSS)

```css
/* contact-search.css */

.noas-reach-contact-search {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1200px;
  margin: 20px auto;
}

.noas-reach-contact-search .search-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.noas-reach-contact-search input[type="search"] {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.noas-reach-contact-search input[type="search"]:focus {
  outline: none;
  border-color: #4a90e2;
}

.noas-reach-contact-search .search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.noas-reach-contact-search .loading-spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Table Styles */
.noas-reach-results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.noas-reach-results-table thead {
  background: #f8f9fa;
}

.noas-reach-results-table th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.noas-reach-results-table th:hover {
  background: #e9ecef;
}

.noas-reach-results-table th .sort-indicator {
  margin-left: 8px;
  opacity: 0.3;
}

.noas-reach-results-table th.sorted .sort-indicator {
  opacity: 1;
}

.noas-reach-results-table th.sorted-asc .sort-indicator::after {
  content: ' ^';
}

.noas-reach-results-table th.sorted-desc .sort-indicator::after {
  content: ' v';
}

.noas-reach-results-table td {
  padding: 12px 15px;
  border-top: 1px solid #eee;
}

.noas-reach-results-table tr:hover td {
  background: #f8f9fa;
}

.noas-reach-results-table .empty-message {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Pagination */
.noas-reach-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.noas-reach-pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.noas-reach-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.noas-reach-pagination .page-info {
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .noas-reach-results-table {
    display: block;
  }
  
  .noas-reach-results-table thead {
    display: none;
  }
  
  .noas-reach-results-table tbody,
  .noas-reach-results-table tr,
  .noas-reach-results-table td {
    display: block;
    width: 100%;
  }
  
  .noas-reach-results-table td::before {
    content: attr(data-label);
    font-weight: 600;
    display: inline-block;
    width: 120px;
    color: #666;
  }
}
```

### 5.4 CiviCRM Integration

#### Adding the Page

Add to `ext/noas-reach/info.xml`:

```xml
<navigationMenu>
  <item>
    <path>Administer/customize noas-reach</path>
    <title>Contact Search</title>
    <url>civicrm/noas-reach/contact-search</url>
    <permission>access CiviCRM</permission>
    <operator>OR</operator>
  </item>
</navigationMenu>
```

#### Creating the Page Class

```php
// ext/noas-reach/CRM/NoasReach/Page/ContactSearch.php
class CRM_NoasReach_Page_ContactSearch extends CRM_Core_Page {
    public function run() {
        CRM_Utils_System::setTitle(ts('Contact Search'));
        
        $this->assign('searchEnabled', true);
        
        parent::run();
    }
}
```

#### AJAX Handler

```php
// ext/noas-reach/CRM/NoasReach/Page/AJAX.php
class CRM_NoasReach_Page_AJAX {
    
    public static function contactSearch() {
        // Validate CSRF token
        if (!CRM_Utils_Type::validate($_POST['csrfToken'] ?? '', ts('CSRF token validation failed'))) {
            echo json_encode(['success' => false, 'error' => ts('Invalid CSRF token')]);
            exit;
        }
        
        $query = $_POST['q'] ?? '';
        $sortBy = $_POST['sort_by'] ?? 'display_name';
        $sortDirection = $_POST['sort_direction'] ?? 'asc';
        $page = (int)($_POST['page'] ?? 1);
        $limit = min((int)($_POST['limit'] ?? 50), 100);
        
        $search = new CRM_NoasReach_Search_ContactSearch();
        $results = $search->search($query, $sortBy, $sortDirection, $page, $limit);
        
        header('Content-Type: application/json');
        echo json_encode($results);
        exit;
    }
}
```

---

## 6. Implementation Phases

### Phase 1: Backend (2-3 hours)
- [ ] Create AJAX endpoint in `CRM/NoasReach/Page/AJAX.php`
- [ ] Create `CRM/NoasReach/Search/ContactSearch.php` with search logic
- [ ] Create `CRM/NoasReach/Search/Formatter.php` for result formatting
- [ ] Add menu item in `info.xml`
- [ ] Create page class `CRM/NoasReach/Page/ContactSearch.php`

### Phase 2: Frontend Core (4-5 hours)
- [ ] Create `js/contact-search.js` with main component
- [ ] Create `js/results-table.js` with table component
- [ ] Create `css/contact-search.css` with styles
- [ ] Implement debounced search (300ms)
- [ ] Implement loading state

### Phase 3: Sorting & Pagination (2-3 hours)
- [ ] Add sort parameters to API
- [ ] Implement sort toggle in table headers
- [ ] Add pagination controls
- [ ] Implement page navigation

### Phase 4: Polish (2 hours)
- [ ] Add mobile responsive styles
- [ ] Add accessibility attributes
- [ ] Add error handling
- [ ] Add empty state messaging
- [ ] Test with various screen sizes

### Phase 5: Testing (2 hours)
- [ ] Unit tests for search logic
- [ ] Integration tests for API
- [ ] Manual testing with real data
- [ ] Performance testing with large datasets

---

## 7. Dependencies

### External
- jQuery (already available in CiviCRM)
- CiviCRM Core APIs

### Internal
- `CRM_NoasReach_ExtensionUtil` (E::) for paths and URLs

---

## 8. Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 80+ | Full support |
| Firefox | 75+ | Full support |
| Safari | 13+ | Full support |
| Edge | 80+ | Full support |
| IE | Not supported | Use Chrome Frame or upgrade |

---

## 9. Accessibility

### Keyboard Navigation
- Tab through search input and buttons
- Arrow keys in table (if enhanced)
- Enter to submit search

### Screen Readers
- ARIA labels on all interactive elements
- Live regions for dynamic content
- Proper heading hierarchy

### Color Contrast
- Minimum 4.5:1 for text
- Avoid color-only indicators
- Support high contrast mode

---

## 10. Performance Considerations

### Optimizations
- Debounce search input (300ms)
- Server-side pagination (50 items per page)
- Cache search results for 5 minutes
- Lazy load table rows for large result sets

### Limits
- Max 100 results per page
- Max 1000 total results returned
- Query timeout: 5 seconds

---

## 11. Security Considerations

- CSRF token validation on all POST requests
- Input sanitization for search queries
- Output escaping in templates
- Permission checks (access CiviCRM)
- Rate limiting (future enhancement)

---

## 12. Open Questions

1. Should we include contact photos/thumbnails in results?
2. Should we support filtering by contact type (Individual, Organization, Household)?
3. Should we support advanced search (multiple fields, operators)?
4. Should results be exportable (CSV, Excel)?
5. Should we integrate with CiviCRM's existing search (Contact Search, Advanced Search)?

---

## 13. Appendices

### Appendix A: Field Mapping

| Display Name | API Field | Sortable | Searchable |
|--------------|-----------|----------|------------|
| ID | contact_id | Yes | Yes |
| Name | display_name | Yes | Yes |
| Email | email | Yes | Yes |
| Phone | phone | Yes | Yes |
| City | city | Yes | Yes |
| State | state_province | Yes | Yes |
| Country | country | Yes | Yes |
| Contact Type | contact_type | Yes | Yes |
| Organization | organization_name | Yes | Yes |

### Appendix B: Error Messages

| Error | Message |
|-------|---------|
| Empty query | "Please enter a search term" |
| No results | "No contacts found matching your search" |
| Network error | "Unable to connect to server. Please try again." |
| Server error | "An error occurred. Please try again or contact support." |

### Appendix C: File Checklist

- [ ] `ext/noas-reach/CRM/NoasReach/Page/AJAX.php`
- [ ] `ext/noas-reach/CRM/NoasReach/Page/ContactSearch.php`
- [ ] `ext/noas-reach/CRM/NoasReach/Search/ContactSearch.php`
- [ ] `ext/noas-reach/CRM/NoasReach/Search/Formatter.php`
- [ ] `ext/noas-reach/js/contact-search.js`
- [ ] `ext/noas-reach/js/results-table.js`
- [ ] `ext/noas-reach/css/contact-search.css`
- [ ] `ext/noas-reach/templates/CRM/NoasReach/Page/ContactSearch.tpl`
- [ ] Update `ext/noas-reach/info.xml`
