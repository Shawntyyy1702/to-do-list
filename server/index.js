import express from "express";
import { db } from "./db.js";

const app = express();
//parse json
app.use(express.json());
const PORT =  3000;


//get user
app.get('/get-users', (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query)
    .then(users => {
        res.status(200).json({users: users.rows})
    });
});

 //get title
app.get('/get-titles', (req, res) => {
    const query = "SELECT * FROM titles";
    db.query(query)
    .then(titles => {
        res.status(200).json({titles: titles.rows})
    });
});

//get list
app.get('/get-lists', (req, res) => {
    const query = "SELECT * FROM lists";
    db.query(query)
    .then(lists => {
        res.status(200).json({lists: lists.rows})
    });
}); 

app.post('/check-accounts', (req, res) => {
    const {username, password } = req.body;

    const query = "SELECT * FROM accounts WHERE username=$1 AND password=$2";

    db.query(query, [username, password])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({exit: true});
        }
        else{
            res.status(200).json({exit: false});
        }
        });
    });

    //register
    app.post('/register', (req, res) =>{
        const {username, password, fname, lname } = req.body;

        const query = "INSERT INTO accounts (username, password, fname, lname) VALUES ($1,$2,$3,$4)";
        db.query(query, [username, password, fname, lname])
        .then(result => {
            res.status(200).json({success: true});
        });
})

app.post('/add-todo', (req, res) => {
    const { username, title, list_desc } = req.body;
    const date_modified = new Date().toISOString().split('T')[0];
    const status = true;
    
    const titleQuery = "INSERT INTO titles (username, title, date_modified, status) VALUES ($1, $2, $3, $4) RETURNING id";
    db.query(titleQuery, [username, title, date_modified, status], (err, titleResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: "Database error" });
        }
        
        const title_id = titleResult.rows[0].id;
        
       
        const listQuery = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, $3)";
        
        list_desc.forEach(desc => {
            db.query(listQuery, [title_id, desc, status], (listErr) => {
                if (listErr) {
                    console.error(listErr);
                    
                }
            });
        });
        
       res.status(200).json({ success: true, message: "Succesfully Added"  });
       
    });
});

app.post('/delete-todo', (req, res) => {
    const { title_id } = req.body;

    const deleteListsQuery = "DELETE FROM lists WHERE title_id = $1";
    db.query(deleteListsQuery, [title_id])
      .then(() => {
        const deleteTitleQuery = "DELETE FROM titles WHERE id = $1";
        return db.query(deleteTitleQuery, [title_id]);
      })
      .then(() => {
        res.status(200).json({ success: true, message: "To-do Successfully Deleted" });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting To-Do List" });
      });
});


app.post('/update-status', (req, res) => {
    const { title_id, list_id, status } = req.body;

    const updateListQuery = "UPDATE lists SET status = $1 WHERE id = $2";
    db.query(updateListQuery, [status, list_id])
        .then(() => {
            const updateTitleQuery = "UPDATE titles SET status = $1 WHERE id = $2";
            return db.query(updateTitleQuery, [status, title_id]);
        })
        .then(() => {
            res.status(200).json({ success: true, message: "List status successfully updated" });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ success: false, message: "Error updating list status" });
        });
});



app.post('/update-todo', (req, res) => {
    const { title_id, list } = req.body;
    const date_modified = new Date().toISOString().split('T')[0];

    const deleteListsQuery = "DELETE FROM lists WHERE title_id = $1";
    db.query(deleteListsQuery, [title_id])
        .then(() => {
            const insertQueries = list.map(task => {
                const insertQuery = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, true)";
                return db.query(insertQuery, [title_id, task]);
            });
            return Promise.all(insertQueries);
        })
        .then(() => {
            const updateTitleQuery = "UPDATE titles SET date_modified = $1 WHERE id = $2";
            return db.query(updateTitleQuery, [date_modified, title_id]);
        })
        
        .then(() => {
            res.status(200).json({ success: true, message: "To-do successfully updated" });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ success: false, message: "Error updating To-Do List" });
        });
});











/*  //add-to-do
app.post('/add-title', (req, res) => {
    const { id, username, title, date_modified, status } = req.body;

    const query = "INSERT INTO titles (id, username, title, date_modified, status) VALUES ($1,$2,$3,$4,$5)";
    db.query(query, [id, username, title, date_modified, status])
        .then(result => {
            res.status(200).json({success: true});

        });
    //object Destructurinf 
    const { fname, lname } = req.body;
    res.send(`Hello ${fname} ${lname}`); 
});

app.post('/add-lists', (req, res) => {
    const { id, title_id, list_desc, status } = req.body;

    const query = "INSERT INTO lists (id, title_id, list_desc, status) VALUES ($1,$2,$3,$4)";
    db.query(query, [id, title_id, list_desc, status])
        .then(result => {
            res.status(200).json({success: true});

        });
});  */


/* //update-to-do
app.get('/update-to-do', (req, res) => {
    res.send('This is update-to-do homepage');
});

//delete-to-do
app.get('/delete-to-do', (req, res) => {
    res.send('This is delete-to-do homepage');
}); */

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);

}); 