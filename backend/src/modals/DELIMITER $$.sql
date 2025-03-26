DELIMITER $$
CREATE PROCEDURE form(IN query_type VARCHAR(20),IN p_Id VARCHAR(50),IN p_date DATE, IN p_name VARCHAR(50),IN p_shop_no INT,IN p_image_url VARCHAR(255))
                      BEGIN 
                      IF query_type = 'insert' THEN
                      INSERT INTO `form`(
                          id,
                          date,
                          name,
                          shop_no,
                          image_url)
                      VALUES(p_Id, p_date, p_name, p_shop_no, p_image_url);
                      END IF;
                      END
DELIMITER$$